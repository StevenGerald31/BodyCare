const getBaseUrl = require("../../utils/getBaseUrl");
const rdf = require("rdflib");
const axios = require("axios"); // Import axios

const store = rdf.graph();
const sparqlEndpoint = "http://localhost:3030/ontology-tugas-akhir/sparql"; // Ganti dengan URL endpoint SPARQL Anda

// const getDataFromOntology = (req, res) => {
//   const sparqlQuery = `
//       prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//       SELECT ?Merek_Bodycare ?Usia
//       WHERE {
//         ?s ?p ?o
//       }
//     `;

//   // Di sini, gunakan dapat menggunakan 'req' untuk mengakses informasi permintaan jika diperlukan
//   const someQueryParam = req.query.someParam;

//   // Kirim kueri SPARQL dan ambil data menggunakan rdflib
//   rdf.parse(
//     sparqlEndpoint + "?query=" + encodeURIComponent(sparqlQuery),
//     store,
//     sparqlEndpoint,
//     "text/turtle",
//     (err, response) => {
//       if (err) {
//         console.error(err);
//         res
//           .status(500)
//           .json({ error: "Internal Server Error", detail: err.message });
//       } else {
//         if (response.status === 200) {
//           const responseData = response.parsedGraph();
//           res.json(responseData);
//         } else {
//           res
//             .status(response.status)
//             .json({ error: "Failed to retrieve data from the ontology" });
//         }
//       }
//     }
//   );
// };

const getDataFromOntology = (req, res) => {
  const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?Nama_Produk ?Usia
    WHERE {
      ?age rdfs:Nama_Produk ?Nama_Produk;
           rdfs:Usia ?Usia.
    }
  `;

  // Kirim kueri SPARQL dan ambil data menggunakan axios
  axios
    .post(sparqlEndpoint, "query=" + encodeURIComponent(sparqlQuery), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        const responseData = response.data;
        // Data dapat diolah lebih lanjut sesuai kebutuhan
        res.json(responseData);
      } else {
        res
          .status(response.status)
          .json({ error: "Failed to retrieve data from the ontology" });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal Server Error", detail: error.message });
    });
};

// Contoh penggunaan
getDataFromOntology(
  {},
  {
    json: function (data) {
      console.log(data);
    },
    status: function (code) {
      console.log(code);
    },
    send: function (message) {
      console.log(message);
    },
  }
);

// const getDataFromOntology = (req, res) => {
//   const sparqlQuery = `
//   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//   PREFIX ontology: <http://example.org/ontology#>
//   SELECT ?Merek_Bodycare ?Usia
//   WHERE {
//     ?s rdf:type ontology:Bodycare ;
//        rdfs:label ?Merek_Bodycare ;
//        ontology:usia ?Usia .
//   }
//   `;

//   axios
//     .post(sparqlEndpoint, "query=" + encodeURIComponent(sparqlQuery), {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Accept: "application/json",
//       },
//     })
//     .then((response) => {
//       if (response.status === 200) {
//         const responseData = response.data;

//         // Mengakses data dari bindings jika ada
//         const results = responseData.results.bindings;

//         if (results.length > 0) {
//           // Ambil nilai dari setiap baris hasil
//           const resultData = results.map((binding) => ({
//             merekBodycare: binding.Merek_Bodycare.value,
//             usia: binding.Usia.value,
//           }));

//           // Kirim hasil ke client
//           res.json(resultData);
//         } else {
//           res.json({
//             message: "Tidak ada data yang cocok dengan kueri SPARQL.",
//           });
//         }
//       } else {
//         res
//           .status(response.status)
//           .json({ error: "Failed to retrieve data from the ontology" });
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "Internal Server Error", detail: error.message });
//     });
// };

// Contoh penggunaan
// getDataFromOntology(
//   {},
//   {
//     json: function (data) {
//       console.log(data);
//     },
//     status: function (code) {
//       console.log(code);
//     },
//     send: function (message) {
//       console.log(message);
//     },
//   }
// );

const addToOntology = (req, res) => {
  const newData = req.body.data;

  // Tambahkan data ke ontologi menggunakan rdflib
  const newTriple = rdf.st(
    rdf.sym(newData.subject),
    rdf.sym(newData.predicate),
    rdf.sym(newData.object)
  );
  store.add(newTriple);

  res.json({ message: "Data added to ontology successfully" });
};

const pageBeranda = async (req, res) => {
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
<<<<<<< HEAD
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
module.exports = {
  pageBeranda,
  getDataFromOntology,
  addToOntology,
  pageLogin,
  pageAdmin,
};
=======

module.exports = { pageBeranda, getDataFromOntology };
>>>>>>> efab6c5d83d7f6a593db865cae975e946e639b95
