import { Platform } from 'react-native'
let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://192.168.100.231:4000/api/v1/'
        : baseURL = 'http://localhost:4000/api/v1/'
}
//wifie sa bahay 192.168.100.231
//data ko 192.168.43.114
export default baseURL;