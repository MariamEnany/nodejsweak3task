const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const cc = require("currency-converter-lt");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/products", (req, res, next) => {
  const curr = req.query.CUR;
  if (!curr) {
    return res.json({
      message: "Currency param is missing",
    });
  }

  getData(curr).then((response) => {
    return res.json({
      Data: response,
    });
  });
});

const getData = async (curr) => {
  const data = await axios.get("https://api.escuelajs.co/api/v1/products");
  if (data.status === 200) {
    let t = [];
    t = Object.entries(data["data"]);
    console.log(t);
    let currencyConverter = new cc();
    t.forEach((el) => {
      currencyConverter
        .from("USD")
        .to(curr)
        .amount(el[1].price)
        .convert()
        .then((result) => {
          el[1].price = result;
          console.log(result);
        });
    });
    return t;
  }
};

app.post("/products", (req, res, next) => {
  const title = req.body.title;
  const categoryId = req.body.categoryId;
  const price = req.body.price;
  const description = req.body.description;
  const images = req.body.images;

  if (!title || !description || !price || !categoryId || !images) {
    return res.json({
      message: "Data is not correct",
    });
  }

  const data = {
    title: title,
    categoryId: categoryId,
    price: price,
    images: images,
    description: description,
  };

  // If the incoming data is correct, i send the post request to URL
  axios
    .post("https://api.escuelajs.co/api/v1/products/", data)
    .then((response) => {
      console.log(response["data"]);
    })
    .catch((err) => {
      console.log(err);
    });
});


app.listen(3000, () => {
    console.log(`Server is up and running`);
  });