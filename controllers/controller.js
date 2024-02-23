const {
  Product,
  ProductHasCategory,
  Category,
  User
} = require("../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

class Controller {
  static async home(req, res) {
    try {
      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async directHome(req, res) {
    try {
      res.render("home");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async homeAdmin(req, res) {
    try {
      const id = req.session.userId

      const user = await User.findByPk(id)

      if (user.role !== 'admin') {
        res.redirect('/user')
      }

      res.render("home-admin");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async homeUser(req, res) {
    try {
      const data = await User.findOne();
      res.render("home-user", {
        data,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async signUp(req, res) {
    try {
      let errorMsg = [];
      if (req.query.error) {
        errorMsg = req.query.error.split(",");
      }
      res.render("home", { errorMsg });
    } catch (error) {

      res.send(error);
    }
  }

  static async signUpProcess(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const hashPassword = await bcrypt.hash(password, 12);
      await User.create({ name, email, role, password: hashPassword });
      res.redirect("/login");
    } catch (error) {
      let errorMsg = [];
      if (error.name === "SequelizeValidationError") {
        errorMsg = error.errors.map((err) => err.message);
        res.redirect(`/signup?errors=${errorMsg}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async login(req, res) {
    try {
      const { error } = req.params;
      res.render("login", {
        error,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async loginProcess(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });
      console.log(user);

      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (isValidPassword) {
          if (user.role === "admin") {
            req.session.userId = user.id;
            res.redirect("/admin");
          } else if (user.role === "user") {
            req.session.userId = user.id;
            res.redirect("/user");
          }
        } else {
          const error = "Invalid email or password";
          return res.redirect(`/login?error=${error}`);
        }
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async loginAdmin(req, res) {
    try {
      const { error } = req.params;
      res.render("login-admin", {
        error,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async loginAdminProcess(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });
      return res.redirect("/admin");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showProductAdmin(req, res) {
    try {
      const { deleteMsg } = req.query;
      // const data = await Product.productAdminShowAll();
      const data = await Product.findAll({
        include: [{
          model: ProductHasCategory,
          include: Category
        }],
        order: [
          ["id", "ASC"]
        ]
      })
      // res.send(data)
      res.render("products-admin", { data, deleteMsg });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async showProduct(req, res) {
    try {
      const { buyMsg, orderBy } = req.query;
      let data;
        if (orderBy) {
            data = await Product.productShowAll(orderBy);
        } else {
            data = await Product.findAll({
              order:[
                ["id", "ASC"]
              ],
              where:{
                stock: {
                  [Op.gt]: 0
                }
              }
            });
        }
      res.render("products-user", { data, buyMsg });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async buyProduct(req, res) {
    try {
      let { id } = req.params;
      const userId = req.session.userId;

      let userEmail = await User.findByPk(userId)

      let dataMsg = await Product.findOne({
        where: {
          id: id,
        },
      });

      await Product.increment({
        stock: -1
      }, {
        where: {
          id: id
        }
      })

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ramadianrp@gmail.com",
          pass: "wypr cdyz wbhm wffz",
        },
      });
      async function main() {
        const info = await transporter.sendMail({
          from: '"HackKick8 Avenue"',
          to: `${userEmail.email}`,
          subject: "Order Transaction SuccesFull ✔",
          text: "Your transaction was successful, thank you🤩😘😍",
        });

        console.log("Message sent: %s", info.messageId);
      }

      main().catch(console.error);
      res.redirect(`/products?buyMsg=Success Buy product ${dataMsg.name}!`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async soldProduct(req, res) {
    try {
      let data = await Product.findAll({
        where: {
          stock: {
            [Op.lte]: 0,
          },
        },
        order: [["id", "ASC"]],
      });
      res.render("sold-product-list", { data });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async getAddNewProduct(req, res) {
    try {
      let { errors } = req.query;
      if (errors) {
        errors = errors.split(",");
      }
      console.log(errors);
      res.render("product-add", { errors });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async postAddNewProduct(req, res) {
    try {
      const { name, stock, price, image, type } = req.body;
      const { CategoriesId } = req.body
      // console.log(CategoriesId, '<<<');
      console.log('aa')
      let data = await Product.create({
        name,
        stock,
        price,
        image,
        type,
        UserId: 5,
      });

      if (CategoriesId) {
        await ProductHasCategory.create({
          ProductId: data.id,
          CategoriesId: CategoriesId
        })
      }
      console.log('bbbbbbb')
      // console.log(data)
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
      let errorMsg = [];
      if (error.name === "SequelizeValidationError") {
        errorMsg = error.errors.map((err) => err.message);
        res.redirect(`/admin/products/add?errors=${errorMsg}`);
      } else {
        console.log(error);
        res.send(error);
      }
    }
  }

  static async getEditProduct(req, res) {
    try {
      const { id } = req.params;
      let { errors } = req.query;
      if (errors) {
        errors = errors.split(",");
      }
      const selectedProduct = await Product.findByPk(id, {
        include: {
          model: ProductHasCategory,
          include: Category
        }
      });
      const category = await Category.findAll()
      // res.send(selectedProduct)
      res.render("product-edit", { selectedProduct, category, errors });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async postEditProduct(req, res) {
    try {
      const { id } = req.params;
      // console.log(req.body, '!!!');
      const { CategoriesId } = req.body
      // console.log(CategoriesId, '<<<');
      const { name, stock, price, image, type } = req.body;
      let data = await Product.update(
        {
          name: `${name}`,
          stock: `${stock}`,
          price: `${price}`,
          image: `${image}`,
          type: `${type}`,
        },
        {
          where: {
            id: id,
          },
        }
      );
      // console.log(id,CategoriesId, "<><><><>");
      if (CategoriesId) {
        await ProductHasCategory.update(
          { CategoriesId: CategoriesId },
          {
            where: {
              ProductId: id
            }
          }
        );
      }

      res.redirect("/admin/products");
      // console.log('dddd')
    } catch (error) {
      let errorMsg = [];
      if (error.name === "SequelizeValidationError") {
        errorMsg = error.errors.map((err) => err.message);
        res.redirect(`/admin/products/edit/${id}?errors=${errorMsg}`);
      } else {
        console.log(error);
        res.send(error.message);
      }
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      let dataMsg = await Product.findOne({
        where: {
          id: id,
        },
      });
      await Product.destroy({
        where: {
          id: `${id}`,
        },
      });

      res.redirect(
        `/admin/products?deleteMsg=Products ${dataMsg.name} has been remove!`
      );
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async logout(req, res) {
    try {
      await req.session.destroy();
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
