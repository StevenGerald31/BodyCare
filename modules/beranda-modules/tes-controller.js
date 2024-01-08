const SparqlClient = require("sparql-http-client");
const getBaseUrl = require("../../utils/getBaseUrl");

const endpointUrl = "http://localhost:3030/tes/sparql";

const executeQuery = async () => {
  const query = `
      PREFIX tes: <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>

      SELECT ?Merek_Bodycare ?Harga ?Usia
      WHERE {
          ?dsn tes:Merek_Bodycare ?Merek_Bodycare;
              tes:Harga ?Harga;
              tes:Usia ?Usia.
          
          FILTER (?Merek_Bodycare = "Sensatia Botanicals")
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

const pageTes = async (req, res) => {
  try {
    // Execute SPARQL query and get results
    const results = await executeQuery();

    // Render the 'viewCoba' with the query results
    return res.render("dashboard", {
      baseUrl: getBaseUrl(req),
      session: req.session,
      user: req.user,
      queryResults: results, // Pass the query results to the view
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
};

module.exports = {
  getQueryResults,
  pageTes,
};
