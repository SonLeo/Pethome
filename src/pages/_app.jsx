import '~/styles/globals.css'
import '~/components/FontAwesomeConfig'
import 'bootstrap/dist/css/bootstrap.min.css'
import { UserProvider } from '~/components/userContext'
import { ToastProvider } from '~/components/toastContext'
import ToastMessage from '~/components/toast/ToastMessage'
import { Provider } from 'react-redux'
import store from '~/rudux/store'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UserProvider>
        <ToastProvider>
          <ToastMessage />
          <Component {...pageProps} />
        </ToastProvider>
      </UserProvider>
    </Provider>
  )
}
