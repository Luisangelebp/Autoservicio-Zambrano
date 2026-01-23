import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from "../controllers/itemsControllers";
import { upload } from "../middlewares/uploads";

const router = Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", upload.single("foto"), createItem);
router.put("/:id", upload.single("foto"), updateItem);
router.delete("/:id", deleteItem);

export default router;