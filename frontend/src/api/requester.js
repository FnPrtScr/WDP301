import axios from 'axios'

const responseBody = (response) => response.data

export const requester = {
  getGoogle: (url, params = {}, config = {}) => axios.get(url, { params, ...config }).then(responseBody),

  // eslint-disable-next-line
  get: (url, params = {}, config = {}) => axios.get(url, { params, headers: { 'token': config } }).then(responseBody),
  post: (url, data = {}, config = {}) => axios.post(url, data, {
    // eslint-disable-next-line
    headers: { 'token': config }
  }).then(responseBody),
  put: (url, data = {}, config = {}) => axios.put(url, data, {
    // eslint-disable-next-line
    headers: { 'token': config }
  }).then(responseBody),
  // eslint-disable-next-line
  delete: (url, params = {}, config = {}) => axios.delete(url, { params, headers: { 'token': config } }).then(responseBody),
  postForm: (url, data, config = {}) => axios.postForm(url, data, {
    // eslint-disable-next-line
    headers: { 'Content-type': 'multipart/form-data', 'token': config }
  }).then(responseBody)
}

export default requester
