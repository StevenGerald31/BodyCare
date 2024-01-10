const SparqlClient = require("sparql-http-client");
const getBaseUrl = require("../../utils/getBaseUrl");
const { get } = require("./beranda-router");

const endpointUrl = "http://localhost:3030/tes/sparql";

const executeQuery = async (query) => {
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

const executeQueryByMerek = async (selectedMerek) => {
  const query = `
          PREFIX tes: <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>
    
          SELECT ?Usia ?Harga ?Manfaat (REPLACE(str(SUBSTR(str(?Masalah_Kulit), STRLEN(str(tes:)) + 1)), "_", " ") as ?Masalah)
          WHERE {
            ?dsn tes:Merek_Bodycare "${selectedMerek}" ;
                 tes:Harga ?Harga ;
                 tes:Usia ?Usia ;
                 tes:Manfaat ?Manfaat;
                 tes:hasSkinIssues ?Masalah_Kulit.
          }
      `;

  const results = await executeQuery(query);
  return results;
};

// Perbaikan pada fungsi getMerekList di controller
const getMerekList = async () => {
  try {
    const query = `
      PREFIX tes: <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>

      SELECT DISTINCT ?Merek_Bodycare
      WHERE {
          ?dsn tes:Merek_Bodycare ?Merek_Bodycare.
      }
    `;
    const results = await executeQuery(query);
    const merekList = results.map((row) => row.Merek_Bodycare.value);

    return merekList; // Mengembalikan nilai merekList
  } catch (error) {
    throw error; // Melemparkan error agar dapat ditangkap di router
  }
};

const pageTes = async (req, res) => {
  try {
    return res.render("viewCoba", {
      baseUrl: getBaseUrl(req),
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
  executeQueryByMerek,
  getMerekList,
  pageTes,
};
