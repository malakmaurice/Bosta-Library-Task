import * as express from "express";
import BookRoutes from "../Book/routes/BookRoutes";
import BorrowerRoutes from "../Borrower/routes/BorrowerRoutes";
const router: express.Router = express.Router();

export default (): express.Router => {
  router.use("/borrower", BorrowerRoutes());
  router.use("/book", BookRoutes());
  return router;
};
