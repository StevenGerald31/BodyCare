const getBaseUrl = require("../../utils/getBaseUrl");
const { sequelize, Sequelize } = require("../../db");
const SparqlClient = require("sparql-http-client");

const pageDashboard = async (req, res) => {
  try {
    return res.render("dashboard", {
      baseUrl: getBaseUrl(req),
      session: req.session,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
};

const pageLogin = async (req, res) => {
  try {
    return res.render("login", {
      baseUrl: getBaseUrl(req),
      session: req.session,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
};

const pageAdmin = async (req, res) => {
  try {
    return res.render("admin", {
      baseUrl: getBaseUrl(req),
      session: req.session,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
};

// sparql query section 
const endpointUrl = "http://localhost:3030/ontology-tugas-akhir/sparql";

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

// query untuk filtering berdasarkan merk
const executeQueryByMerek = async (selectedMerek) => {
  try {
    const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX  : <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>
    
    SELECT (replace(strafter(str(?Merek_Bodycare), '#'), "_", " ") AS ?Merek)  (replace(strafter(str(?Nama_Produk), '#'), "_", " ") AS ?namaProduk)  ?Deskripsi ?Harga ?Manfaat ?Masalah_Kulit ?Harga ?Usia ?Deskripsi
    WHERE {
      ?Merek_Bodycare rdf:type :Merek_Bodycare .
        ?Merek_Bodycare :hasProductName ?Nama_Produk .
        ?Nama_Produk :Deskripsi ?Deskripsi .
        ?Nama_Produk :Harga ?Harga .
        ?Nama_Produk :Deskripsi ?Deskripsi .
        ?Nama_Produk :Manfaat ?Manfaat . 
        ?Nama_Produk :Masalah_Kulit ?Masalah_Kulit .
        ?Nama_Produk :Usia ?Usia .
      
      FILTER (?Merek_Bodycare =:${selectedMerek})
    }
      `;

    const results = await executeQuery(query);
    return results;
  } catch (error) {
    throw error;
  }
};

const pencarian = async (queryFilters) => {
  try {
    const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX : <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>
    
    SELECT (replace(strafter(str(?Nama_Produk), '#'), "_", " ") AS ?NamaProduk) (replace(strafter(str(?Jenis_Bodycare), '#'), "_", " ") AS ?jenisBodycare) (replace(strafter(str(?Masalah_Kulit), '#'), "_", " ") AS ?MasalahKulit) (replace(strafter(str(?Harga), '#'), "_", " ") AS ?harga) (replace(strafter(str(?Merek_Bodycare), '#'), "_", " ") AS ?MerekBodycare) ?ProdukHarga ?Manfaat ?Deskripsi ?Usia
    WHERE {
     ?Nama_Produk rdf:type :Nama_Produk .
    ?Nama_Produk :hasBodycareType ?Jenis_Bodycare .
    ?Nama_Produk :hasSkinIssues ?Masalah_Kulit .
    ?Nama_Produk :Harga ?ProdukHarga .
    ?Nama_Produk :hasPrice ?Harga .
    ?Nama_Produk :Usia ?Usia .
    ?Nama_Produk :Manfaat ?Manfaat .
    ?Nama_Produk :Deskripsi ?Deskripsi .
    ?Nama_Produk :isProductNameOf ?Merek_Bodycare .
    
    ${queryFilters}

    }`;
    const results = await executeQuery(query)

    return results;
  } catch (error) {
    console.log(error)
  }
}

const dataTransaksi = async (req, res) => {
  try {
    const namaProduk = req.query.namaProduk; // Dapatkan nama_produk dari query parameter

    const dataTransaksi = await sequelize.query(
      `SELECT dt.* 
       FROM data_transaksi dt
       JOIN data_bodycare dp ON dt.id_produk = dp.id_produk
       WHERE dp.nama_produk = :namaProduk`,
      {
        replacements: { namaProduk: namaProduk },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json(dataTransaksi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
}

const dataAlgoritma = async (req, res) => {
  try {
    const dataRekomendasi = await sequelize.query(
      "SELECT * FROM data_transaksi",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json(dataRekomendasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const hasilAlgoritma = async (req, res) => {
  try {
    const produkIdArray = req.body.produkHasilId;
    const produkIdString = produkIdArray.join(",");

    const produkData = await sequelize.query(
      `SELECT data_bodycare.*, AVG(data_transaksi.rating) as rating
      FROM data_bodycare 
      LEFT JOIN data_transaksi ON data_bodycare.id_produk = data_transaksi.id_produk
      WHERE data_bodycare.id_produk IN (${produkIdString})
      GROUP BY data_bodycare.id_produk`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json(produkData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};


module.exports = { pageDashboard, pageLogin, pageAdmin, executeQueryByMerek, pencarian, dataTransaksi, dataAlgoritma, hasilAlgoritma };
