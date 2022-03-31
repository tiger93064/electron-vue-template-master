import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default createVuetify({
    theme: {
      themes: {
        light: {
          colors: {
            // primary: '#1976d2',
            // background: '#E5E5E5',
            // error: '#d63031',
            // info: '#0984e3',
            // secondary: '#66bb6a',
            // success: '#00cec9',
            // surface: '#6c5ce7',
            // warning: '#2d3436',

            background: '#E5E5E5',
            surface: '#FFFFFF',
            primary: '#1976d2',
            secondary: '#66bb6a',
            error: '#B00020',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00'
          
          },
          dark: false,
          variables: {},
        },
      },
    },
  });
