import { useState, useEffect } from 'react';
import './App.css';
import coordenadasCiudad from "./componentes/coordenadasCiudad.json"
import Lugar from './componentes/Lugar';
import Termometro from './componentes/Termometro';
import DiaYHorario from './componentes/DiaYHorario';
import Temperaturas from './componentes/Temperaturas';
import CuadroBloques from './componentes/CuadroBloques';
import CuadroTemperatura from './componentes/CuadroTemperatura';
import Transporte from './componentes/Transporte';

function App() {
  const [apiData, setApiData] = useState({});
  const [cargando, setCargando] = useState(true);
  const [lugarSeleccionadoDefault, setLugarSeleccionadoDefault] = useState("Córdoba");
  const [lugarSeleccionado, setLugarSeleccionado] = useState(lugarSeleccionadoDefault);
  const [esDeDia, setEsDeDia] = useState(true);
  const linea = "Linea";
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${coordenadasCiudad[lugarSeleccionado].latitud}&longitude=${coordenadasCiudad[lugarSeleccionado].longitud}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,visibility,windspeed_10m,uv_index,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=America%2FSao_Paulo&forecast_days=1`;

  useEffect(() => {
    if (apiURL) {
      setCargando(true);
      fetch(apiURL)
        .then((resp) => resp.json())
        .then((data) => {
          setApiData(data);
          setCargando(false);
          // Determinar si es de día o de noche cuando los datos se cargan
          const ActualmenteEsDeDia = data.current_weather.is_day === 1;
          setEsDeDia(ActualmenteEsDeDia);
          console.log(esDeDia);
        })
        .catch((ex) => {
          console.error(ex);
          setCargando(false);
        });
    }
  }, [apiURL, esDeDia]);

  return (
    <div className={`App ${esDeDia ? "diurno" : "nocturno"}`}>
      <header className="App-header">
        <div className='contenedorPrincipal'>
          <div className='appClima'>
            <div className='arriba'>
              <Lugar lugarSeleccionado={lugarSeleccionado} setLugarSeleccionado={setLugarSeleccionado}/>
            </div>
            <div className='izquierdaYDerecha'>
              <div className='izquierda'>
              {!cargando && <Termometro temperatura={apiData.current_weather.temperature} cargando={cargando}/>}
              {!cargando && <DiaYHorario time={apiData.current_weather.time} cargando={cargando}/>}
              {!cargando && <Temperaturas temperaturaMaxima={apiData.daily.temperature_2m_max} temperaturaMinima={apiData.daily.temperature_2m_min}
                unidadMedidaTemperaturaMaxima={apiData.daily_units.temperature_2m_max} unidadMedidaTemperaturaMinima={apiData.daily_units.temperature_2m_min}
                cargando={cargando}
              />}
              </div>

              <div className='derecha'>
                {!cargando && 
                <div className='aspectosDestacados'> 
                  <h3 className='tituloAspectosDestacados'> Aspectos destacados </h3>
                  <CuadroBloques apiData={apiData} sunrise={apiData.daily.sunrise} sunset={apiData.daily.sunset}
                    precipitation={apiData.hourly.precipitation_probability} relativehumidity_2m={apiData.hourly.relativehumidity_2m}
                    visibility={apiData.hourly.visibility} windspeed={apiData.current_weather.windspeed}
                    uv_index_max={apiData.hourly.uv_index} cargando={cargando}
                    />
                </div>
                }
              </div>
            </div>

            <div className='abajo'>
              {!cargando &&
              <div className='temperaturaDiaria'> 
                <h3 className='hoy'> Hoy </h3>
                 <CuadroTemperatura apiData={apiData} time={apiData.hourly.time} temperature_2m={apiData.hourly.temperature_2m} cargando={cargando}/>
              </div>
              }
            </div> 
          </div>
        
          <div className='appTransporte'>
            <Transporte linea={linea}/>
          </div>
        </div>  
      </header>
    </div>
  );
}
export default App;