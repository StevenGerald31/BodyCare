const getBaseUrl = require("../../utils/getBaseUrl");
const { sequelize, Sequelize } = require("../../db");
const SparqlClient = require("sparql-http-client");
const admin = require("../model/admin-model")
const user = require("../model/user-model")

const pageDashboard = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id_pelanggan = req.session.user.id_pelanggan; // Ambil id_pelanggan dari objek sesi

    

    return res.render("dashboard", {
      baseUrl: getBaseUrl(req),
      session: req.session,
      user: req.user,
      id_pelanggan: id_pelanggan
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
};

const pageFormUserBaru = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.render("formuserbaru", {
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

const dataMasalahKulit = async (req, res) => {
  try {

    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    id_pelanggan = req.session.user.id_pelanggan

    const masalah_kulit = req.body.masalah

    const query = `
    UPDATE info_pelanggan
    SET masalah_kulit = :masalah_kulit
    WHERE id_pelanggan = :id_pelanggan
    ` 
    const result = await sequelize.query(query, {
      replacements: { masalah_kulit, id_pelanggan },
      type: Sequelize.QueryTypes.UPDATE,
    });

    return result;

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi Kesalahan Sistem",
    });
  }
}

const rekomendasiUserNew = async (req,res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  pelanggan_id = req.session.user.id_pelanggan

  const query = `
  WITH bodycare_transaksi AS (
    SELECT 
        dt.id_produk,
        dt.masalah_kulit,
        dt.nama_produk,
        dt.jenis_bodycare,
        AVG(dtg.rating) AS avg_rating
    FROM 
        data_transaksi dtg
    INNER JOIN 
        data_bodycare dt ON dtg.id_produk = dt.id_produk
    GROUP BY 
        dt.id_produk, dt.masalah_kulit, dt.nama_produk, dt.jenis_bodycare
    )

    SELECT 
        bt.id_produk,
        bt.nama_produk,
        bt.jenis_bodycare,
        bt.masalah_kulit,
        bt.avg_rating,
        db.*
    FROM 
        bodycare_transaksi bt
    INNER JOIN 
        info_pelanggan ip ON bt.masalah_kulit = ip.masalah_kulit
    INNER JOIN
        data_bodycare db ON bt.id_produk = db.id_produk
    WHERE 
        ip.id_pelanggan = :pelanggan_id
    ORDER BY 
        bt.avg_rating DESC;
  `;

  const result = await sequelize.query(query, {
    replacements: { pelanggan_id },
    type: Sequelize.QueryTypes.SELECT,
  });

  // Mengirimkan hasil sebagai respons ke klien
  res.status(200).json(result);
}

const pageSiginSigupUser = async (req, res) => {
  try {
    return res.render("siginsigupuser", {
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

const signInUser = async (req, res) => {
  const { username, password} = req.body; 

  try {
    const userLogin = await user.findOne({ where: { username, password}});
    if (!userLogin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Simpan id_pelanggan ke dalam sesi
    req.session.user = {
      id_pelanggan: userLogin.id_pelanggan,
      // Anda juga bisa menyimpan data lain yang dibutuhkan di sesi di sini
    };

    id_pelanggan = req.session.user.id_pelanggan
    console.log("id_pelanggan", id_pelanggan)

    // cek id_pelanggan sudah pernah rating atau belum
    const query = `
      SELECT *
      FROM data_transaksi
      WHERE id_pelanggan = :id_pelanggan
    `;

    const transaksi = await sequelize.query(query, {
      replacements: { id_pelanggan },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (transaksi.length === 0) {
      // Jika id_pelanggan tidak ada di tabel transaksi, redirect ke '/web/formuserbaru'
      return res.redirect('/web/formuserbaru');
    }

    req.session.user = userLogin;
    res.redirect('/web/dashboard'); // Redirect to dashboard route

    return(id_pelanggan)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
}

const signUpUser = async (req,res) => {
  const { username, alamat, no_hp, password } = req.body;

  try {
    const newUser = await user.create({username, alamat, no_hp, password})
    res.redirect('/web/siginsigup')
    console.log("new user: ", newUser)
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating user" });
  }
}

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

// login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminuser = await admin.findOne({ where: { email, password } });
    if (!adminuser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.redirect("/web/admin?id=${adminuser.id_admin}")
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in" });
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


module.exports = { pageDashboard, pageLogin, pageFormUserBaru, pageAdmin, pageSiginSigupUser, signInUser, signUpUser, loginAdmin, executeQueryByMerek, pencarian, dataTransaksi, dataAlgoritma, hasilAlgoritma, dataMasalahKulit, rekomendasiUserNew };
