# TasksApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tasksGet**](#tasksget) | **GET** /tasks | Get all tasks|
|[**tasksIdDelete**](#tasksiddelete) | **DELETE** /tasks/{id} | Delete a task|
|[**tasksIdGet**](#tasksidget) | **GET** /tasks/{id} | Get a task by ID|
|[**tasksIdPut**](#tasksidput) | **PUT** /tasks/{id} | Update a task|
|[**tasksPost**](#taskspost) | **POST** /tasks | Create a new task|

# **tasksGet**
> GetAllTasksResponse tasksGet()

Retrieves all tasks for the authenticated user

### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

const { status, data } = await apiInstance.tasksGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetAllTasksResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tasks retrieved successfully |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksIdDelete**
> DeleteTaskResponse tasksIdDelete()

Deletes a specific task by its ID for the authenticated user

### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: string; //The ID of the task (default to undefined)

const { status, data } = await apiInstance.tasksIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the task | defaults to undefined|


### Return type

**DeleteTaskResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Task deleted successfully |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Task not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksIdGet**
> GetTaskByIdResponse tasksIdGet()

Retrieves a specific task by its ID for the authenticated user

### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: string; //The ID of the task (default to undefined)

const { status, data } = await apiInstance.tasksIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the task | defaults to undefined|


### Return type

**GetTaskByIdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Task retrieved successfully |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Task not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksIdPut**
> UpdateTaskResponse tasksIdPut(updateTaskRequest)

Updates a task for the authenticated user

### Example

```typescript
import {
    TasksApi,
    Configuration,
    UpdateTaskRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let id: string; //The ID of the task (default to undefined)
let updateTaskRequest: UpdateTaskRequest; //

const { status, data } = await apiInstance.tasksIdPut(
    id,
    updateTaskRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTaskRequest** | **UpdateTaskRequest**|  | |
| **id** | [**string**] | The ID of the task | defaults to undefined|


### Return type

**UpdateTaskResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Task updated successfully |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksPost**
> CreateTaskResponse tasksPost(createTaskRequest)

Creates a new task for the authenticated user

### Example

```typescript
import {
    TasksApi,
    Configuration,
    CreateTaskRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let createTaskRequest: CreateTaskRequest; //

const { status, data } = await apiInstance.tasksPost(
    createTaskRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTaskRequest** | **CreateTaskRequest**|  | |


### Return type

**CreateTaskResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Task created successfully |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

