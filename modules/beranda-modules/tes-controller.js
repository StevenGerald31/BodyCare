const SparqlClient = require("sparql-http-client");

const endpointUrl = "http://localhost:3030/tes/sparql";

const executeQuery = async () => {
  const query = `
    PREFIX tes: <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>

    SELECT ?Usia ?Harga
        WHERE {
            ?dsn tes:Usia ?Usia;
            tes:Harga ?Harga.
        }
    `;

  const client = new SparqlClient({ endpointUrl });
  const stream = await client.query.select(query);

  return new Promise((resolve, reject) => {
    const results = [];

    stream.on("data", (row) => {
      const formattedRow = {};
      Object.entries(row).forEach(([key, value]) => {
        formattedRow[key] = {
          value: value.value,
          termType: value.termType,
        };
      });
      results.push(formattedRow);
    });

    stream.on("end", () => {
      resolve(results);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

const getQueryResults = async (req, res) => {
  try {
    const results = await executeQuery();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getQueryResults,
};
