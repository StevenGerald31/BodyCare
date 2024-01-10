const SparqlClient = require("sparql-http-client");
const getBaseUrl = require("../../utils/getBaseUrl");

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
    
          SELECT ?Usia ?Nama_Produk ?Merek_Bodycare ?Harga ?Manfaat  (REPLACE(str(SUBSTR(str(?Masalah_Kulit), STRLEN(str(tes:)) + 1)), "_", " ") as ?Masalah)
          WHERE {
            ?dsn tes:Merek_Bodycare "${selectedMerek}" ;
                 tes:Harga ?Harga ;
                 tes:hasProductName ?Nama_Produk ;
                 tes:Usia ?Usia ;
                 tes:Manfaat ?Manfaat;
                 tes:hasBodycareType ?Jenis_Bodycare;
                 tes:hasSkinIssues ?Masalah_Kulit;
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

const getAllData = async () => {
  try {
    const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX tes: <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>
        
    SELECT ?Merek_Bodycare ?Masalah_Kulit ?Jenis_Bodycare ?Nama_Produk ?Usia ?Harga
    WHERE {
      ?Merek_Bodycare rdf:type tes:Merek_Bodycare.
      ?Merek_Bodycare tes:hasProductName ?Nama_Produk .
      ?Merek_Bodycare tes:hasAge ?Usia .
      ?Nama_Produk tes:hasBodycareType ?Jenis_Bodycare .
      ?Nama_Produk tes:hasPrice ?Harga .
      ?Nama_Produk tes:hasSkinIssues ?Masalah_Kulit .
      
    }
    `;
    const results = await executeQuery(query);
    const allData = results.map((row) => {
      return {
        merek: row.Merek_Bodycare.value,
        masalah: row.Masalah_Kulit.value,
        jenis: row.Jenis_Bodycare.value,
        nama: row.Nama_Produk.value,
        usia: row.Usia.value,
        harga: row.Harga.value,
      };
    });
    return allData;
  } catch (error) {
    throw error;
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
  getAllData,
};
