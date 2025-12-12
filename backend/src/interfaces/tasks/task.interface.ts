/**
 * @openapi
 * components:
 *   schemas:
 *     TaskInterface:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - completed
 *         - userId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         completed:
 *           type: boolean
 *           description: The completion status of the task
 *         userId:
 *           type: string
 *           description: The user ID of the task
 *         createdAt:
 *           type: string
 *           description: The creation date of the task
 *         updatedAt:
 *           type: string
 *           description: The last update date of the task
 */
export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTaskResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success status of the request
 *         message:
 *           type: string
 *           description: The message of the request
 *         data:
 *           type: object
 *           description: The data of the task
 *           $ref: '#/components/schemas/TaskInterface'
 */
export interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: TaskInterface;
}
/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateTaskRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         completed:
 *           type: boolean
 *           description: The completion status of the task
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateTaskResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success status of the request
 *         message:
 *           type: string
 *           description: The message of the request
 *         data:
 *           type: object
 *           description: The data of the task
 *           $ref: '#/components/schemas/TaskInterface'
 */
export interface UpdateTaskResponse {
  success: boolean;
  message: string;
  data: TaskInterface;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     DeleteTaskRequest:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the task
 */
export interface DeleteTaskRequest {
  id: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     GetTaskByIdRequest:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the task
 */
export interface GetTaskByIdRequest {
  id: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     GetTaskByIdResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success status of the request
 *         message:
 *           type: string
 *           description: The message of the request
 *         data:
 *           type: object
 *           description: The data of the task
 *           $ref: '#/components/schemas/TaskInterface'
 */
export interface GetTaskByIdResponse {
  success: boolean;
  message: string;
  data: TaskInterface;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     GetAllTasksResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success status of the request
 *         message:
 *           type: string
 *           description: The message of the request
 *         data:
 *           type: array
 *           description: Array of tasks
 *           items:
 *             $ref: '#/components/schemas/TaskInterface'
 */
export interface GetAllTasksResponse {
  success: boolean;
  message: string;
  data: TaskInterface[];
}

/**
 * @openapi
 * components:
 *   schemas:
 *     DeleteTaskResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success status of the request
 *         message:
 *           type: string
 *           description: The message of the request
 *         data:
 *           type: object
 *           description: The deleted task data
 *           $ref: '#/components/schemas/TaskInterface'
 */
export interface DeleteTaskResponse {
  success: boolean;
  message: string;
  data: TaskInterface;
}
