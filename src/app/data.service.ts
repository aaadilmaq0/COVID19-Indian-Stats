import { Injectable } from "@angular/core";
import * as cheerio from "cheerio";
import * as request from "request";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { resolve } from "dns";
@Injectable({
  providedIn: "root"
})
export class DataService {
  data: {
    name: string;
    indian?: number;
    foreign?: number;
    cured?: number;
    death?: number;
    lat: number;
    lng: number;
    total?: number;
  }[] = [
    {
      name: "Andhra Pradesh",
      lat: 15.9129,
      lng: 79.74
    },
    {
      name: "Delhi",
      lat: 28.7041,
      lng: 77.1025
    },
    {
      name: "Haryana",
      lat: 29.065773,
      lng: 76.0856
    },
    {
      name: "Karnataka",
      lat: 15.317277,
      lng: 75.71389
    },
    {
      name: "Kerala",
      lat: 10.850516,
      lng: 76.27108
    },
    {
      name: "Maharashtra",
      lat: 19.66328,
      lng: 75.300293
    },
    {
      name: "Odisha",
      lat: 20.94092,
      lng: 84.803467
    },
    {
      name: "Punjab",
      lat: 31.1471,
      lng: 75.3412
    },
    {
      name: "Rajasthan",
      lat: 27.391277,
      lng: 73.432617
    },
    {
      name: "Tamil Nadu",
      lat: 11.059821,
      lng: 78.387451
    },
    {
      name: "Telengana",
      lat: 17.123184,
      lng: 79.208824
    },
    {
      name: "Union Territory of Jammu and Kashmir",
      lat: 33.7782,
      lng: 76.5762
    },
    {
      name: "Union Territory of Ladakh",
      lat: 34.2996,
      lng: 78.2932
    },
    {
      name: "Uttar Pradesh",
      lat: 28.207609,
      lng: 79.82666
    },
    {
      name: "Uttarakhand",
      lat: 30.0668,
      lng: 79.0193
    }
  ];

  colors: string[] = [
    "#FF7E00",
    "#9966CC",
    "#A4C639",
    "#CD9575",
    "#665D1E",
    "#915C83",
    "#841B2D",
    "#008000",
    "#FBCEB1",
    "#00FFFF",
    "#7FFFD4",
    "#4B5320",
    "#8F9779",
    "#E9D66B",
    "#FF9966",
    "#A52A2A",
    "#FDEE00",
    "#568203",
    "#007FFF",
    "#89CFF0",
    "#F4C2C2",
    "#FF91AF",
    "#FAE7B5",
    "#DA1884",
    "#7C0A02",
    "#9F8170",
    "#2E5894",
    "#9C2542",
    "#3D2B1F",
    "#967117",
    "#CAE00D",
    "#FE6F5E",
    "#BF4F51",
    "#000000",
    "#3D0C02",
    "#A89595",
    "#54626F",
    "#BFAFB2",
    "#FF9900",
    "#A57164",
    "#318CE7",
    "#660000",
    "#0000FF",
    "#A2A2D0",
    "#6699CC",
    "#0D98BA",
    "#064E40",
    "#5DADEC",
    "#126180",
    "#8A2BE2",
    "#5072A7",
    "#DE5D83",
    "#79443B",
    "#006A4E",
    "#87413F",
    "#CB4154",
    "#D891EF",
    "#4D1A7F",
    "#1974D2",
    "#FFAA1D",
    "#FF55A3",
    "#FB607F",
    "#004225",
    "#CD7F32",
    "#88540B",
    "#1B4D3E",
    "#F0DC82",
    "#800020",
    "#DEB887",
    "#A17A74",
    "#CC5500",
    "#E97451",
    "#8A3324",
    "#BD33A4",
    "#702963",
    "#536872",
    "#AE8F73",
    "#E30022",
    "#FFF600",
    "#A67B5B",
    "#4B3621",
    "#A3C1AD",
    "#C19A6B",
    "#EFBBCC",
    "#FFFF99",
    "#E4717A",
    "#00BFFF",
    "#592720",
    "#C41E3A",
    "#00CC99",
    "#960018",
    "#FFA6C9",
    "#B31B1B",
    "#56A0D3",
    "#ED9121",
    "#00563F",
    "#703642",
    "#C95A49",
    "#ACE1AF",
    "#007BA7",
    "#2F847C",
    "#B2FFFF",
    "#246BCE",
    "#DE3163",
    "#007BA7",
    "#2A52BE",
    "#6D9BC3",
    "#1DACD6",
    "#007AA5",
    "#E03C31",
    "#F7E7CE",
    "#F1DDCF",
    "#36454F",
    "#232B2B",
    "#E68FAC",
    "#DFFF00",
    "#7FFF00",
    "#FFB7C5",
    "#954535",
    "#DE6FA1",
    "#A8516E",
    "#AA381E",
    "#856088",
    "#FFB200",
    "#7B3F00",
    "#D2691E",
    "#FFA700",
    "#98817B",
    "#E34234",
    "#CD607E",
    "#E4D00A",
    "#9FA91F",
    "#7F1734",
    "#0047AB",
    "#D2691E",
    "#6F4E37",
    "#B9D9EB",
    "#F88379",
    "#8C92AC",
    "#B87333",
    "#DA8A67",
    "#AD6F69",
    "#CB6D51",
    "#996666",
    "#FF3800",
    "#FF7F50",
    "#F88379",
    "#893F45",
    "#FBEC5D",
    "#6495ED",
    "#FFF8DC",
    "#2E2D88",
    "#FFF8E7",
    "#81613C",
    "#FFBCD9",
    "#FFFDD0",
    "#DC143C",
    "#9E1B32",
    "#F5F5F5",
    "#00FFFF",
    "#00B7EB",
    "#58427C",
    "#FFD300",
    "#F56FA1",
    "#666699",
    "#654321",
    "#5D3954",
    "#26428B",
    "#008B8B",
    "#536878",
    "#B8860B",
    "#013220",
    "#006400",
    "#1A2421",
    "#BDB76B",
    "#483C32",
    "#534B4F",
    "#543D37",
    "#8B008B",
    "#4A5D23",
    "#556B2F",
    "#FF8C00",
    "#9932CC",
    "#03C03C",
    "#301934",
    "#8B0000",
    "#E9967A",
    "#8FBC8F",
    "#3C1414",
    "#8CBED6",
    "#483D8B",
    "#2F4F4F",
    "#177245",
    "#00CED1",
    "#9400D3",
    "#00703C",
    "#555555",
    "#DA3287",
    "#FAD6A5",
    "#B94E48",
    "#004B49",
    "#FF1493",
    "#FF9933",
    "#00BFFF",
    "#4A646C",
    "#7E5E60",
    "#1560BD",
    "#2243B6",
    "#C19A6B",
    "#EDC9AF",
    "#696969",
    "#1E90FF",
    "#D71868",
    "#967117",
    "#00009C",
    "#EFDFBB",
    "#E1A95F",
    "#555D50",
    "#C2B280",
    "#1B1B1B",
    "#614051",
    "#F0EAD6",
    "#1034A6",
    "#7DF9FF",
    "#00FF00",
    "#6F00FF",
    "#CCFF00",
    "#BF00FF",
    "#8F00FF",
    "#50C878",
    "#6C3082",
    "#1B4D3E",
    "#B48395",
    "#AB4B52",
    "#CC474B",
    "#563C5C",
    "#00FF40",
    "#96C8A2",
    "#C19A6B",
    "#801818",
    "#B53389",
    "#DE5285",
    "#F400A1",
    "#E5AA70",
    "#4D5D53",
    "#4F7942",
    "#6C541E",
    "#FF5470",
    "#B22222",
    "#CE2029",
    "#E95C4B",
    "#E25822",
    "#EEDC82",
    "#0063dc",
    "#FB0081",
    "#A2006D",
    "#FFFAF0",
    "#15F4EE",
    "#5FA777",
    "#014421",
    "#228B22",
    "#A67B5B",
    "#856D4D",
    "#0072BB",
    "#FD3F92",
    "#86608E",
    "#9EFD38"
  ];

  uri: string = "https://www.mohfw.gov.in/";

  constructor(private http: HttpClient) {}

  getData() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.uri, {
          headers: new HttpHeaders({
            Accept: "text/html, application/xhtml+xml, */*",
            "Content-Type": "application/x-www-form-urlencoded"
          }),
          responseType: "text"
        })
        .toPromise()
        .then(
          response => {
            let data = [],
              tIndians = 0,
              tForeign = 0,
              tCured = 0,
              tDeaths = 0;
            const $ = cheerio.load(response);
            let lastUpdated = $("body > div:nth-child(3) > div > div > div > ol > li:nth-child(2) > strong > p")
              .text()
              .trim()
              .split("as on ")[1];
              lastUpdated = lastUpdated ||  $("body > div:nth-child(3) > div > div > div > ol > strong > strong > strong > p")
              .text()
              .trim()
              .split("as on ")[1];
            if(lastUpdated) lastUpdated = lastUpdated.substring(0, lastUpdated.length - 1);
            const rows = $("tr");
            rows.each((i, element) => {
              if (i === 0 || i === rows.length - 1) return;
              const _ = cheerio.load(element);
              let name = $(_("td")[1])
                .text()
                .trim();
              let d = this.data.find(Data => Data.name == name);
              if (!d) return;
              let lat = d.lat,
                lng = d.lng;
              let indian = +$(_("td")[2])
                .text()
                .trim();
              tIndians += indian;
              let foreign = +$(_("td")[3])
                .text()
                .trim();
              tForeign += foreign;
              let cured = +$(_("td")[4])
                .text()
                .trim();
              tCured += cured;
              let death = +$(_("td")[5])
                .text()
                .trim();
              tDeaths += death;
              let total = indian + foreign;
              data.push({
                name,
                indian,
                foreign,
                cured,
                death,
                total,
                lat,
                lng
              });
            });
            resolve({ data, lastUpdated, tIndians, tForeign, tCured, tDeaths });
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getColors(): string[] {
    return this.colors;
  }
}
