  /*update count only when the component renders

  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []); // <- add empty brackets here
  <h1>I've rendered {count} times!</h1>
*/

/*
FOR WEB SERVER
Add .env file 
HTTPS= true
install Certbot
Add to env variable:
SSL_CRT_FILE=cert.crt 
SSL_KEY_FILE=cert.key
$env:SSL_CRT_FILE='C:\Certbot\live\insight.thingsplus.io/cert.pem'
$env:SSL_KEY_FILE='C:\Certbot\live\insight.thingsplus.io/privkey.pem'

FOR TELEGRAPH:
CHANGE URL TO HTTPS
FOR INFLUXDB:
USE REVERSE PROXY 
CHANGE URL TO HTTPS
*/