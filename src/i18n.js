import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    resources: {
        en: {
            translation: {
              search_routes: 'Search Routes',
              information: 'Information',
              about_colectivos: 'About Colectivos',
              about_rc: 'About Rutas Colectivos',
              contact_info: 'Contact',
              log_in: 'Log In',
              create_account: 'Create Account',
              profile: 'Profile',
              add_route: 'Add Route',
              no_account: 'No Account?',
              create_one: ' Create One!',
              email_address: 'Email Address',
              password: 'Password',
              username: 'Username',
              select_language: 'Select Language',
              every: 'Every',
              from_time: 'From',
              until_time: 'Until',
              like: 'Like',
              dislike: 'Dislike',
              suggest_edit: 'Suggest an edit',
              password_length: 'please use a password 7 characters or longer',
              valid_email: 'please use a valid email address',
              user_not_found: 'user not found',
              wrong_password: 'incorrect password',
              unknown_error: 'something unexpected went wrong',
              username_length: 'please use a username 5 characters or longer',
              already_account: 'Already have an account?',
              log_out: 'Log Out',
              user_exists: 'A user with that email already exists',
              minimize: 'Minimize',
              maximize: 'Show toolbar',
              start_location: 'From',
              end_location: 'To',
              price: 'Price',
              colour: 'Color'
            }
          },
          es: {
            translation: {
              search_routes: 'Buscar Rutas',
              information: 'Informacion',
              about_colectivos: 'Sobre Colectivos',
              about_rc: 'Sobre Rutas Colectivos',
              contact_info: 'Contacto',
              log_in: 'Iniciar Sesión',
              create_account: 'Crear Una Cuenta',
              profile: 'Perfil',
              add_route: 'Añadir Ruta',
              no_account: 'Sin Cuenta?',
              create_one: ' Crear Una!',
              email_address: 'Correo Electrónico',
              password: 'Contraseña',
              username: 'Nombre de usario',
              select_language: 'Seleccione el Idioma',
              every: 'Cada',
              from_time: 'Desde las',
              until_time: 'Hasta las',
              like: 'Me gusto',
              dislike: 'Disgusto',
              suggest_edit: 'Sugerir una edición',
              password_length: 'utilice una contraseña de 7 caracteres o más',
              valid_email: 'utilice una dirección de correo electrónico válida',
              user_not_found: 'usuario no encontrado',
              wrong_password:'contraseña incorrecta',
              unknown_error: 'algo inesperado salió mal',
              username_length: 'utilice un nombre de usuario de 5 caracteres o más',
              already_account: '¿Ya tienes una cuenta?',
              log_out: 'Cerrar Sesíon',
              user_exists: 'Un usuario con ese email ya existe',
              minimize: 'Minimizar',
              maximize: 'Mostrar la barra de herramientas',
              start_location: 'De',
              end_location: 'A',
              price: 'Cuesta',
              colour: 'Color'
          }
        }
    }
  });

export default function (app) {
  app.use(I18NextVue, { i18next })
  app.use(i18next.handle)
  return app
}