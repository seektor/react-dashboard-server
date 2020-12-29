import express, { NextFunction, Request, Response } from "express";
import { TodoModel } from "../db/models/TodoModel";
import authMiddleware from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const TodosRouter = express.Router();

interface TodoData {
  id: number;
  title: string;
  description: string;
}

type TodosGetRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>
> &
  AuthenticatedRequest;
type ToastGetResponse = Response<
  { data: TodoData[] } & Record<string, unknown>
>;

TodosRouter.get(
  "/todos",
  authMiddleware,
  async (req: TodosGetRequest, res: ToastGetResponse, next: NextFunction) => {
    try {
      const { user } = req.body;
      const todos = await TodoModel.findAll({ where: { userId: user.id } });
      return res.status(201).send({ data: todos });
    } catch (error) {
      next(error);
    }
  }
);

type TodoCreateRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Omit<TodoData, "id">
> &
  AuthenticatedRequest;
type TodoCreateResponse = Response<
  { data: TodoData } & Record<string, unknown>
>;

TodosRouter.post(
  "/todos",
  authMiddleware,
  async (
    req: TodoCreateRequest,
    res: TodoCreateResponse,
    next: NextFunction
  ) => {
    try {
      const { user, title, description } = req.body;
      if (!title || !description) {
        throw new Error("Missing 'Title' or 'Description' data!");
      }
      const newToast = await TodoModel.create({
        userId: user.id,
        description,
        title,
      });
      return res.status(201).send({
        data: {
          description: newToast.description,
          id: newToast.id,
          title: newToast.title,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

type TodoDeleteRequestParams = {
  id: string;
} & Record<string, string>;
type TodoDeleteRequest = Request<TodoDeleteRequestParams> &
  AuthenticatedRequest;

TodosRouter.delete(
  "/todos/:id",
  authMiddleware,
  async (req: TodoDeleteRequest, res: Response, next: NextFunction) => {
    try {
      const { user } = req.body;
      const { id } = req.params;
      if (!id) {
        throw new Error("Missing toast id!");
      }
      const delCount = await TodoModel.destroy({
        where: { id, userId: user.id },
      });
      if (!delCount) {
        throw new Error("No toast with the provided id!");
      }
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);

export default TodosRouter;
