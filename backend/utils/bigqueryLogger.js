const { bigquery, project } = require('../config/gcp');

const datasetId = process.env.BIGQUERY_DATASET || 'teja_analytics';
const tableId = 'metrics';

/**
 * Log metric to BigQuery
 */
const logToBigQuery = async (metricData) => {
  try {
    const dataset = bigquery.dataset(datasetId);
    const table = dataset.table(tableId);

    // Prepare row matching the user's requested format
    const row = {
      userId: metricData.user?.toString(),
      type: metricData.endpoint,
      input: metricData.input || '',
      output: metricData.output || '',
      latency: metricData.latency,
      cost: metricData.cost || 0,
      status: metricData.status,
      model: metricData.model || 'gemini-1.5-flash-vertex',
      timestamp: new Date().toISOString()
    };

    await table.insert([row]);
    console.log(`Log successfully inserted into BigQuery table ${tableId}`);
  } catch (error) {
    console.error('BigQuery Logging Error:', error);
    // We don't want to crash the request if logging fails, but we should know about it
    if (error.name === 'PartialFailureError') {
      console.error('Partial Failure details:', error.errors);
    }
  }
};

/**
 * Initialize BigQuery Table if it doesn't exist
 */
const initBigQuery = async () => {
  try {
    const [datasets] = await bigquery.getDatasets();
    let dataset = datasets.find(d => d.id === datasetId);
    
    if (!dataset) {
      [dataset] = await bigquery.createDataset(datasetId);
      console.log(`Dataset ${datasetId} created.`);
    }

    const [tables] = await dataset.getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) {
      const schema = [
        { name: 'userId', type: 'STRING' },
        { name: 'type', type: 'STRING' },
        { name: 'input', type: 'STRING' },
        { name: 'output', type: 'STRING' },
        { name: 'latency', type: 'INTEGER' },
        { name: 'cost', type: 'FLOAT' },
        { name: 'status', type: 'STRING' },
        { name: 'model', type: 'STRING' },
        { name: 'timestamp', type: 'TIMESTAMP' },
      ];
      [table] = await dataset.createTable(tableId, { schema });
      console.log(`Table ${tableId} created.`);
    }
  } catch (error) {
    console.error('BigQuery Initialization Error:', error);
  }
};

module.exports = { logToBigQuery, initBigQuery };
