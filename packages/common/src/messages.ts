export const TOTAL_DECIMAL = 1000_000_000;

//TODO: FIX THE BACKEND URL AFTER DEPLOYING THE BACKEND
export const BACKEND_URL = (process.env.NODE_ENV !== 'development') ? 'https://api.tudum.com/' : 'http://localhost:8000/'
export const UPLOAD_SUCCESS = `Uploaded the Images Successfully`
export const TASK_SUCCESS = `Successfully created the task !!`