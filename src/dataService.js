import axios from 'axios';

export function getData() {
    return axios.get('/api/test/student/grade/').then(res => res.data)
  }