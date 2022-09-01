import { DrawerHeader, Main } from "../component/Drawer";
import logo from "../logo.svg";
import "./Home.css";

const Home = ({openDrawer}) => {
  return (
    <Main className="Home" openDrawer={openDrawer}>
      <DrawerHeader/>
      <h1 className="Home-title">
        Built with
      </h1>
      <div className="Home-images">
        <img src={logo} className="React-logo" alt="logo" />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/c/c6/Influxdb_logo.svg"
          }
          className="Influx-logo"
          alt="logo"
        />
          <img
          src={
           "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
          }
          className="Nodejs-logo"
          alt="logo"
        />
      </div>
    </Main>
  );
};

export default Home;
