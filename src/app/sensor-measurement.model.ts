// import {Deserializable} from './deserializable.model';

export class SensorMeasurement /* implements Deserializable */{

  // SensorMeasurement (model) is not currently used.  But we can use this as a template for future models.

  static prevLatitude = 69.47852668866463;
  static prevLongitude = -60.30429526899292;

  private id: number;

  private vesselId: string;
  private timestamp: Date;

  private latitude: number;
  private longitude: number;

  private COG: number;
  // More fields go here

  private engineRpm: number;
  private IAT: number;
  private EGT: number;
  private WJT: number;
  private fuelConsumption: number;

  private AQI: number;  // The raw data is PM2.5, PM10, etc
  private windSpeed: number;
  private windDirection: number;
  private humidity: number;
  private temperature: number;
  private barometricPressure: number;


  // private cars: [];

  constructor(vesselId){

    if(vesselId){
      this.vesselId = vesselId;
    }
    else{
      this.vesselId = this.generateVesselId();
    }





    this.generateSampleData();
  }


  private generateRandomNumber(min, max, round = false) {
    let num = Math.random() * (max - min) + min;
    if(round){
      num = Math.round(num);
    }
    return num;
  }

  private generateVesselId(length = 24) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private generateSampleData() {

    this.timestamp = new Date();  // What timestamp format to use?

    SensorMeasurement.prevLatitude += 0.05;
    SensorMeasurement.prevLongitude += 0.05;
    this.latitude = SensorMeasurement.prevLatitude;
    this.longitude = SensorMeasurement.prevLongitude;

    this.COG = this.generateRandomNumber(191, 199, true);

    this.engineRpm = this.generateRandomNumber(3000, 6000, true);

    this.IAT = 12;

    this.EGT = 200;

    this.WJT = 95;

    this.fuelConsumption = this.generateRandomNumber(2300, 2800, true);

    this.AQI = 26;

    this.windSpeed = this.generateRandomNumber(20, 30, true);

    this.windDirection = this.generateRandomNumber(210, 230);

    this.humidity = 30;

    this.temperature = 13;

    this.barometricPressure = 101.3;

  }


  // deserialize(input: any): this {
  //   // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
  //   Object.assign(this, input);
  //
  //   // Iterate over all cars for our user and map them to a proper `Car` model
  //   // this.cars = input.cars.map(car => new Car().deserialize(car));
  //
  //   this.cars = input;
  //
  //   return this;
  // }
}


/*

    AIS - Automatic information system is a line of sight RF communications system that ships use to exchange information. It's known as a class of secondary surveillance radar (e.g. the target transmits info about itself vs a passive reflection of a signal)
    MMSI, Lat, Long, COG, SOG are the fields we care the most about.
      Location and x=v*t tells us where the ship will be in the near future (
      The MMSI uniquely identifies the ship to correlate against other sources.
      SOG speed over ground, 20kts cruising
    COG course over ground, should be along the intended route
    Heading, actual direction the ship is pointing. Offset due to weather/swell
    For the data interface, everything should be referenced to UTC using GPS time. The translation to something interpretable should take place at the UI level.

      For shipboard sensors,
      engine RPM
    IAT (intake air temp close to atmospheric)
    EGT (exhaust gas temp ~200C)
    WJT (water jacket temp ~95C)
    Fuel consumption (500 to 3000 GPH, 2625 nominal)
    I can get you some examples of exhaust gas concentrations

    I'll get the gas concentrations to you soon. It's late.

      For atmospheric sensors
    NOx, PM 2.5, PM 10, HC are the major components to calculate the AQI, air quality index.
    Wind (0-60? kts)
    Direction (0-259)
    Humidity 0-100%
    Temperature
    Barometric pressure (~101.325 kPa. 87.7 to 108) 101.3 is a good day, Low is bad weather, high is hot low wind. Changes indicate a change in the weather is coming.

      The full set of fields:
      MMSI Maritime Mobile Service Identity, unique ID
    TIME data timestamp AIS format – unix timestamp Human readable format – UTC
    LONGITUDE +/- 180 degrees
    LATITUDE +/- 90 degrees
    COG Degrees. COG=360.0 means “not available” (0.0-359.9)
    SOG knots. SOG=102.4 means “not available” (expected 0-25)
    HEADING current heading of the AIS vessel at the time of the last message value in degrees, HEADING=511 means “not available”
    PAC Position Accuracy 0 – low accuracy 1 – high accuracy
    ROT Rate of Turn deg/min
    NAVSTAT Navigational Status (0-15, enum)
    IMO IMO ship identification number
    NAME vessel’s name (max.20 chars)
    CALLSIGN vessel’s callsign
    TYPE vessel’s type (0-99, enum)
    DEVICE positioning device type (more details here)
    A Dimension to Bow (meters)
    B Dimension to Stern (meters)
    C Dimension to Port (meters)
    D Dimension to Starboard (meters)
    DRAUGHT meters
    DEST vessel’s destination text
    ETA Estimated Time of Arrival UTC/GPS time


 */
