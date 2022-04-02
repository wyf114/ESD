package flight.search.selection;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class SelectionController {
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/search/{query}")
	public String searchFlights(@PathVariable String query)  throws IOException{
		//return query;
		
		URL url = new URL ("https://apigw.singaporeair.com/api/uat/v1/commercial/flightavailability/get");

		HttpURLConnection con = (HttpURLConnection)url.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("apikey", "d4ayfn8u4xb84cd7c7hk3n9k");

		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Content-Type", "application/json");

		
		con.setDoOutput(true); 

		//String jsonInputString = "{\"clientUUID\":\"05b2fa78-a0f8-4357-97fe-d18506618c3f\",\"request\":{\"itineraryDetails\":[{\"originAirportCode\":\"SIN\",\"destinationAirportCode\":\"BKK\",\"departureDate\":\"2022-11-01\", \"returnDate\": \"2022-11-10\"}], \"cabinClass\": \"Y\", \"adultCount\": 1, \"childCount\": 0, \"infantCount\": 0}}";
		try(OutputStream os = con.getOutputStream()){
			byte[] input = query.getBytes("utf-8");
			os.write(input, 0, input.length);			
		}

		int code = con.getResponseCode();
		System.out.println(code);
		
		try(BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))){
			StringBuilder response = new StringBuilder();
			String responseLine = null;
			while ((responseLine = br.readLine()) != null) {
				response.append(responseLine.trim());
			}
			String resp = response.toString();
			return resp;
		}
	}
}
