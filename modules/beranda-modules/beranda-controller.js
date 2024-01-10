const getBaseUrl = require("../../utils/getBaseUrl");
const rdf = require("rdflib");

const store = rdf.graph();
const sparqlEndpoint =
  "http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40"; // Ganti dengan URL endpoint SPARQL Anda

const getDataFromOntology = (req, res) => {
  const sparqlQuery = `
      PREFIX tes: <http://www.semanticweb.org/gusve/ontologies/2023/10/untitled-ontology-40#>
      SELECT ?Merek_Bodycare ?Usia
      WHERE {
        ?age tes:Merek_Bodycare ?Merek_Bodycare;
            tes:Usia ?Usia.
      }
    `;

  // Di sini, Anda dapat menggunakan 'req' untuk mengakses informasi permintaan jika diperlukan
  const someQueryParam = req.query.someParam;

  // Kirim kueri SPARQL dan ambil data menggunakan rdflib
  rdf.parse(
    sparqlEndpoint + "?query=" + encodeURIComponent(sparqlQuery),
    store,
    sparqlEndpoint,
    "text/turtle",
    (err, response) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Internal Server Error", detail: err.message });
      } else {
        if (response.status === 200) {
          const responseData = response.parsedGraph();
          res.json(responseData);
        } else {
          res
            .status(response.status)
            .json({ error: "Failed to retrieve data from the ontology" });
        }
      }
    }
  );
};

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
