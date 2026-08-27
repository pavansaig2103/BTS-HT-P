const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const { v4: uuidv4 } = require('uuid');

let rawSupabaseClient = null;
let useRemoteSupabase = false;

const isSupabaseConfigured = Boolean(
  env.SUPABASE_URL &&
  env.SUPABASE_SERVICE_ROLE_KEY &&
  !env.SUPABASE_URL.includes('your-project') &&
  !env.SUPABASE_SERVICE_ROLE_KEY.includes('your-supabase')
);

// In-memory database store
const inMemoryStore = {
  users: [],
  user_accessibility_profiles: [],
  documents: [],
  workflows: [],
  workflow_steps: [],
  workflow_requirements: [],
  ai_interactions: [],
};

// In-Memory Query Builder
class MockQueryBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.filters = [];
    this.orderConfig = null;
    this.limitCount = null;
    this.singleResult = false;
    this.isInsert = false;
    this.isUpdate = false;
    this.isDelete = false;
    this.insertData = null;
    this.updateData = null;
  }

  select(columns = '*') {
    this.selectedColumns = columns;
    return this;
  }

  insert(data) {
    this.isInsert = true;
    this.insertData = data;
    return this;
  }

  update(data) {
    this.isUpdate = true;
    this.updateData = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column, value) {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig = { column, ascending };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  maybeSingle() {
    this.singleResult = true;
    return this;
  }

  async execute() {
    let table = inMemoryStore[this.tableName];
    if (!table) {
      inMemoryStore[this.tableName] = [];
      table = inMemoryStore[this.tableName];
    }

    // 1. Handle Insert
    if (this.isInsert) {
      const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const insertedRows = items.map((item) => {
        const row = {
          id: item.id || uuidv4(),
          ...item,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        };
        table.push(row);
        return row;
      });

      const resultData = this.singleResult
        ? insertedRows[0]
        : Array.isArray(this.insertData)
        ? insertedRows
        : insertedRows[0];
      return { data: resultData, error: null };
    }

    // 2. Handle Select / Filter
    let rows = [...table];
    for (const filter of this.filters) {
      if (filter.operator === 'eq') {
        rows = rows.filter((r) => r[filter.column] === filter.value);
      } else if (filter.operator === 'neq') {
        rows = rows.filter((r) => r[filter.column] !== filter.value);
      }
    }

    // 3. Handle Delete
    if (this.isDelete) {
      inMemoryStore[this.tableName] = inMemoryStore[this.tableName].filter(
        (r) => !rows.some((row) => row.id === r.id)
      );
      return { data: rows, error: null };
    }

    // 4. Handle Update
    if (this.isUpdate && this.updateData) {
      const updatedTimestamp = new Date().toISOString();
      const updatedRows = [];
      for (const row of rows) {
        Object.assign(row, this.updateData, { updated_at: updatedTimestamp });
        updatedRows.push(row);
      }
      return {
        data: this.singleResult ? updatedRows[0] || null : updatedRows,
        error: null,
      };
    }

    // 5. Handle Sort & Pagination
    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig;
      rows = [...rows].sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (this.limitCount) {
      rows = rows.slice(0, this.limitCount);
    }

    if (this.singleResult) {
      return {
        data: rows[0] || null,
        error: rows.length === 0 ? { message: 'Not found', code: 'PGRST116' } : null,
      };
    }

    return { data: rows, error: null };
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

// Fallback storage simulator
const mockStorage = {
  from(bucket) {
    return {
      async upload(filePath, fileBuffer, options = {}) {
        return { data: { path: filePath }, error: null };
      },
      async download(filePath) {
        return { data: Buffer.from('mock file content'), error: null };
      },
      async createSignedUrl(filePath, expiresIn = 3600) {
        return {
          data: { signedUrl: `https://mock-storage.local/${bucket}/${filePath}?token=mock` },
          error: null,
        };
      },
    };
  },
};

if (isSupabaseConfigured) {
  try {
    rawSupabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message);
  }
}

// Check remote schema availability synchronously or fallback gracefully
async function checkSupabaseSchema() {
  if (!rawSupabaseClient) return false;
  try {
    const { error } = await rawSupabaseClient.from('users').select('id').limit(1);
    if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
      console.log('ℹ️ Remote Supabase tables not migrated yet. Operating in deterministic in-memory mode.');
      useRemoteSupabase = false;
    } else if (!error) {
      console.log('✅ Remote Supabase tables detected and active.');
      useRemoteSupabase = true;
    }
  } catch (err) {
    useRemoteSupabase = false;
  }
  return useRemoteSupabase;
}

// Kick off probe
checkSupabaseSchema();

const supabase = {
  from: (tableName) => {
    if (useRemoteSupabase && rawSupabaseClient) {
      return rawSupabaseClient.from(tableName);
    }
    return new MockQueryBuilder(tableName);
  },
  storage: rawSupabaseClient ? rawSupabaseClient.storage : mockStorage,
  inMemoryStore,
};

module.exports = {
  supabase,
  isSupabaseConfigured,
  inMemoryStore,
  checkSupabaseSchema,
};
