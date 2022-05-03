import React, { useEffect, useState } from "react";

const SearchWeather = () => {
  //  we pass this to our url we get this fron input
  const [search, setSearch] = useState("Toronto");
  // we get this from our api call
  const [data, setData] = useState([]);
  // we use this with the onChange event
  const [input, setInput] = useState("");

  //use effect runs whenever search is changed
  useEffect(() => {
    // making an asynchronous function , calling the weather api
    const fetchApi = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=ccf7bb4a78de7dac80afffb6ab0986e2`;
      const response = await fetch(url);
      //converting the response to json , you can see a sample response under the sample_response folder
      const resJson = await response.json();
      // setting data to the data hook
      setData(resJson);
      console.log(resJson);
    };
    fetchApi();
  }, [search]);

  //handle submit is called when we write our input and press the submit button,
  // it then pass the input value to setSearch
  const handleSubmit = (e) => {
    // to prevent the defaukt action of form submission i.e, refresh
    e.preventDefault();
    setSearch(input);
  };

  // setting the emojis according to the weather
  let emoji = null;
  // if we do not get the data or data does'nt exist it simply shows ...loading
  // data.weather[0].main shows the type of weather
  if (typeof data.main != "undefined") {
    if (data.weather[0].main === "Clouds") {
      emoji = "fa-cloud";
    } else if (data.weather[0].main === "Thunderstorm") {
      emoji = "fa-bolt";
    } else if (data.weather[0].main === "Drizzle") {
      emoji = "fa-cloud-rain";
    } else if (data.weather[0].main === "Rain") {
      emoji = "fa-cloud-shower-heavy";
    } else if (data.weather[0].main === "Snow") {
      emoji = "fa-snow-flake";
    } else {
      emoji = "fa-smog";
    }
  } else {
    return <div>...Loading</div>;
  }

  //converting the data from kelvin to celsius
  let temp = (data.main.temp - 273.15).toFixed(2);
  let temp_min = (data.main.temp_min - 273.15).toFixed(2);
  let temp_max = (data.main.temp_max - 273.15).toFixed(2);
  // let feels_like = (data.main.feels_like - 273.15).toFixed(2);

  // Date

  let d = new Date();
  // Obtain current local time "getTime() returns the number of milliseconds since January 1, 1970 00:00:00."
  let localTime = d.getTime();
  /*
  UTC—Coordinated Universal Time—is the 24-hour time standard 
  used as a basis for civil time today. All time zones are defined
  by their offset from UTC.

  date.getTimezoneOffset() returns the difference, in minutes, 
  between date as evaluated in the UTC time zone, and date as 
  evaluated in the local time zone — that is, the time zone of 
  the host system in which the browser is being used (if the 
  code is run from the Web in a browser), or otherwise the 
  host system of whatever JavaScript runtime (for example, 
  a Node.js environment) the code is executed in.

  The number of minutes returned by getTimezoneOffset() is 
  positive if the local time zone is behind UTC, and negative 
  if the local time zone is ahead of UTC. For example, for 
  UTC+10, -600 will be returned. => 600/60 =10
  */

  /*Find local time offset
  d.getTimezoneOffset() returns our local timezone offset from utc in minutes ex: -420 => -420/60 = 7 hours
  - sign means timezone is ahead of utc
  ex : India UTC+05:30
  1 minute = 60_000 milliseconds 
*/

  let localOffset = d.getTimezoneOffset() * 60000;
  // Obtain current UTC time
  let utc = localTime + localOffset;
  // Obtain destination city's offset in hours and convert to milliseconds
  // 1 second = 1000 milliseconds , data.timezone is in seconds
  var currentCity = utc + 1000 * `${data.timezone}`;
  // convert to readable format
  let nd = new Date(currentCity);

  let date = nd.getDate();
  let year = nd.getFullYear();
  let month = nd.toLocaleString("default", { month: "long" });
  let day = nd.toLocaleString("default", { weekday: "long" });
  // Time
  let time = nd.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      {/* outer container */}
      <div className="container mt-5">
        {/* bootstrap row class */}
        <div className="row justify-content-center">
          {/* column medium -4) */}
          <div className="col-md-4">
            {/* card css from bootstrap */}
            <div className="card text-white text-center border-0">
              {/* here we are using unsplash to change the img according to the weather data.weather[0].main wil give the weather*/}
              <img
                src={`https://source.unsplash.com/600x800/?${data.weather[0].main}`}
                className="card-img"
                alt="..."
              />
              <div className="card-img-overlay">
                {/* search bar , handle submit passes the input to search */}
                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-4 w-75 mx-auto">
                    <input
                      type="search"
                      className="form-control inputFeild"
                      placeholder="Search city"
                      aria-label="earch city"
                      name="search"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                      }}
                      required
                    />
                    <button type="submit" className="input-group-text" id="">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </form>

                <div className="bg-dark bg-opacity-50 ">
                  <h2 className="card-title">
                    {data.name},{data.sys.country}
                  </h2>
                  <p className="card-text lead">
                    {day} , {month} {date}, {year}
                    <br />
                    {time}
                    <br />
                    wind : {data.wind.speed} m/s
                    <br />
                  </p>
                  <i className={`fas ${emoji} fa-3x`}></i>
                  <h1 className="fw-bolder mb-1">{temp} &deg;C</h1>
                  <p className="lead fw-bolder mb-0">{data.weather[0].main}</p>
                  <p className="lead">
                    L {temp_min}&deg;C | {temp_max}&deg;C H
                  </p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(https://source.unsplash.com/600x800/?${data.weather[0].main})`,
                padding: "15px",
                color: "#fefefe",
              }}
            >
              <div
                className="bg-dark bg-opacity-50 py-3"
                style={{
                  padding: "15px",
                }}
              >
                <h4>Made by Atul Taneja</h4>
              </div>
            </div>
            {/* Footer closed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWeather;
