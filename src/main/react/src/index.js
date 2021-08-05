import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { StylesProvider, createGenerateClassName } from '@material-ui/styles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import store from './store'
import { Provider } from 'react-redux'

const project_name = 'health-screening'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#b89f74',
      main: '#877148',
      dark: '#58461f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#56a2ea',
      main: '#0074b7',
      dark: '#004987',
      contrastText: '#fff',
    },
  },
})

const generateClassName = createGenerateClassName({
  productionPrefix: project_name,
  disableGlobal: true,
})

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <StylesProvider generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById(project_name)
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
