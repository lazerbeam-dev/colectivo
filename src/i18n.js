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
              search_routes: 'search routes',
              information: 'information',
              about_colectivos: 'About Colectivos',
              about_rc: 'About Rutas Colectivos',
              contact_info: 'Contact',
              log_in: 'log in',
              create_account: 'Create account',
              profile: 'Profile',
              add_route: 'add route',
              no_account: 'no account?',
              create_one: 'create one!',
              email_address: 'email address',
              password: 'password',
              username: 'username',
              select_language: 'select language',
              every: 'every',
              from_time: 'from',
              until_time: 'until',
              like: 'like',
              dislike: 'dislike',
              suggest_edit: 'suggest an edit',
              password_length: 'please use a password 7 characters or longer',
              valid_email: 'please use a valid email address',
              user_not_found: 'user not found',
              wrong_password: 'incorrect password',
              unknown_error: 'something unexpected went wrong',
              username_length: 'please use a username 5 characters or longer',
              already_account: 'already have an account?',
              log_out: 'log out',
              user_exists: 'a user with that email already exists',
              minimize: 'minimize',
              maximize: 'show toolbar',
              start_location: 'from',
              end_location: 'to',
              price: 'price',
              colour: 'color',
              add_start: 'select start', 
              add_end: 'select end',
              add_waypoint: 'add waypoint',
              get_directions: 'get directions',
              start_time: "start time", 
              end_time: "end time",
              save: "save",
              clear: "clear",
              add_return: "add return route",
              addRoute: "add route",
              editRoute: "edit route",
              outbound_points: "outbound points",
              return_points: "return points",
              add: "create",
              edit: "edit",
              need_start: "you need a start and an end",
              undefined: "undefined",
              error: "error",
              save_successful: "save successful",
              cancel: "cancel",
              delete_successful: "delete successful",
              delete_route: "delete route",
              confirm_delete_route: "confirm delete route"
            }
          },
          es: {
            translation: {
              search_routes: 'buscar rutas',
              information: 'informacion',
              about_colectivos: 'sobre colectivos',
              about_rc: 'sobre rutas colectivos',
              contact_info: 'contacto',
              log_in: 'iniciar sesión',
              create_account: 'crear una cuenta',
              profile: 'perfil',
              add_route: 'añadir ruta',
              no_account: 'sin cuenta?',
              create_one: ' crear una!',
              email_address: 'correo electrónico',
              password: 'contraseña',
              username: 'nombre de usario',
              select_language: 'seleccione la idioma',
              every: 'cada',
              from_time: 'desde las',
              until_time: 'hasta las',
              like: 'me gusta',
              dislike: 'disgusto',
              suggest_edit: 'sugerir una edición',
              password_length: 'utilice una contraseña de 7 caracteres o más',
              valid_email: 'utilice una dirección de correo electrónico válida',
              user_not_found: 'usuario no encontrado',
              wrong_password:'contraseña incorrecta',
              unknown_error: 'algo inesperado salió mal',
              username_length: 'utilice un nombre de usuario de 5 caracteres o más',
              already_account: '¿ya tienes una cuenta?',
              log_out: 'cerrar sesíon',
              user_exists: 'un usuario con ese email ya existe',
              minimize: 'minimizar',
              maximize: 'mostrar la barra de herramientas',
              start_location: 'de',
              end_location: 'a',
              price: 'cuesta',
              colour: 'color',
              add_start: 'elige un punto de partida', 
              add_end: 'elige el lugar de destino',
              add_waypoint: 'agregar destino',
              get_directions: 'obtener las direcciones',
              start_time: "hora de inicio", 
              end_time: "hora de finalización",
              save: "guardar",
              clear: "eliminar todo",
              add_return: "añadir ruta de regresa",
              addRoute: "añadir ruta",
              editRoute: "editar route",
              outbound_points: "puntos en camina",
              return_points: "puntos de regresa",
              add: "crear",
              edit: "editar",
              need_start: "necesita un comienzo y un final",
              undefined: "indefinido",
              error: "falta",
              save_successful: "se guardo correctamente",
              cancel: "cancelar",
              delete_successful: "eliminar exitoso",
              delete_route: "eliminar ruta",
              confirm_delete_route: "confirmar eliminar ruta"
          }
        }
    }
  });

export default function (app) {
  app.use(I18NextVue, { i18next })
  app.use(i18next.handle)
  return app
}