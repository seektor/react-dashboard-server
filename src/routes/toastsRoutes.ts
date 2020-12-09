import express, { Request, Response } from "express";
import { ToastModel } from "../db/models/ToastModel";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const ToastsRouter = express.Router();

interface Toast {
  id?: number;
  title?: string;
  description?: string;
}

type ToastCreateRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Toast
> &
  AuthenticatedRequest;
type ToastCreateResponse = Response<Toast & { error?: string }>;

ToastsRouter.post(
  "/toasts",
  authMiddleware,
  async (req: ToastCreateRequest, res: ToastCreateResponse) => {
    try {
      const { user, title, description } = req.body;
      if (!title || !description) {
        throw new Error("Invalid field.");
      }
      const newToast = await ToastModel.create({
        userId: user.id,
        description,
        title,
      });
      return res
        .status(201)
        .send({
          description: newToast.description,
          id: newToast.id,
          title: newToast.title,
        });
    } catch (error) {
      return res.status(400).send({
        error:
          error.message || "Error while creating Toast... Try again later.",
      });
    }
  }
);

type ToastGetRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>
> &
  AuthenticatedRequest;
type ToastGetResponse = Response<{ toasts?: Toast[] } & { error?: string }>;

ToastsRouter.get(
  "/toasts",
  authMiddleware,
  async (req: ToastGetRequest, res: ToastGetResponse) => {
    try {
      const { user } = req.body;
      const toasts = await ToastModel.findAll({ where: { userId: user.id } });
      return res.status(201).send({ toasts });
    } catch (error) {
      return res.status(400).send({
        error:
          error.message || "Error while getting Toasts... Try again later.",
      });
    }
  }
);

type ToastDeleteRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  { id?: string }
> &
  AuthenticatedRequest;
type ToastDeleteResponse = Response<{ error?: string }>;

ToastsRouter.delete(
  "/toasts",
  authMiddleware,
  async (req: ToastDeleteRequest, res: ToastDeleteResponse) => {
    try {
      const { user, id } = req.body;
      if (!id) {
        throw new Error("Missing toast id.");
      }
      const delCount = await ToastModel.destroy({
        where: { id, userId: user.id },
      });
      if (!delCount) {
        throw new Error("No toast with the provided id.");
      }
      return res.status(201).send();
    } catch (error) {
      return res.status(400).send({
        error:
          error.message || "Error while removing Toast... Try again later.",
      });
    }
  }
);

export default ToastsRouter;
