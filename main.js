Vue.component('mrz-component', {
    props: ['rows'],
    template: `<div class="placeholder mrz" title="Machine Readable Zone">
		<div>
			<center v-for="row in rows" v-if="row.length > 0" :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{row}}</center>
		</div>
	</div>`,});
Vue.component('vis-component', {
    props: ['page','photo_is_allowed','document_header'],
    template: `
	<div class="content">
		<div class="placeholder title" v-if="$parent.render_mode == 1" @click="$parent.properties($parent.fields[0])">
			<center>{{$parent.select("countryname")}}</center>
		</div>
		<div class="vis">
			<div class="aside-photo" v-if="photo_is_allowed">
				<div class="row" v-if="document_header">
					<div class="placeholder field" @click="$parent.properties($parent.fields[1])">{{$parent.select("document")}}</div>
				</div>
				<div class="row">
					<div class="flex-center photo" :style="($parent.style.personalization) ? '' : 'opacity: 0;'">
						<div class="placeholder photo" :style="'background-image:url('+$parent.photo+')'">
							<input type="file" id="gp" v-on:input="$parent.getFile('#gp',function(e){$parent.photo = e})">
						</div>
					</div>
				</div>
			</div>
			<draggable class="fields draggable" v-model="$parent.layout[page]">
				<draggable :list="$parent.layout[page][rowid]" group="vis" v-model="$parent.layout[page][rowid]" class="row" v-if="$parent.layout.length > 0" v-for="row,rowid in $parent.layout[page]">
					<div v-for="col in row" :title="col.title" @click="$parent.properties(col)" :style="'width:'+col.width+'mm;'" class="placeholder field">
						<label :style="'color: '+$parent.style.labels.color+'; font-size: '+$parent.style.labels.fontSize+'px'">{{col.title}}</label>
						<p :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{col.value}}</p>
					</div>
				</draggable>
			</draggable>
		</div>
	</div>`,});
Vue.component('background-component',{
	props: ["page"],
	template: `<div class="background">
		<div class="layer" 
			v-for="layer,id in $parent.background" 
			:style="\`z-index:\`+(993 - id)+\`;background-image:url(\${layer.image});filter: brightness(\${layer.brightness})contrast(\${layer.contrast})blur(\${layer.blur}px)hue-rotate(\${layer.hue}deg);opacity:\${layer.opacity};\`" 
			v-if="layer.active && (layer.pageBound == false || (layer.pageBound == true && layer.pageNumber == page))">
		</div>
		<div class="layer" style="background-color: #FFF;"></div>
	</div>`})
var root = new Vue({
	el: "#main",
	data: {
		page: 0,
		render: `welcome`,
		settings: 'properties',
		render_mode: 1,
		selected: {},
		style: {
			personalization: true,
			variant: 'mrv-a',
			labels: {
				color: `#000`,
				fontSize: 6.0,
				fontWeight: 1.0
			},
			params: {
				fontFamily: `ocrb`
			},
			display: "normal",
			perforation: {
				position: "right",
				height: 20,
				fontSize: 8,
			}
		},
		tabs:[
			{name:"Properties",code:"properties"},
			{name:"Design",code:"design"},
			// {name:"Fields",code:"fields"},
			// {name:"Pages",code:"pages",wlist:["passport"]},
			{name:"Layers",code:"layers"},
			// {name:"Layout",code:"layout"},
		],
		photo: ``,
		selected_layer: 0,
		createLayer()
		{
			this.background = [{
				title: "",
				image: "",
				pageBound: false, // Linked to a specific page
				pageNumber: 0, // Page number
				active: true,
				opacity: 1, // float 0 .. 1
				brightness: 1, // float 0 .. 1 .. 10
				contrast: 1, // float 0 .. 1 .. 10
				blur: 0, // px 0 .. 255
				hue: 0, // deg -180 .. 0 .. 180
			}].concat(this.background);
		},
		background: [
		],
		properties(property)
		{
			this.settings = 'properties';
			this.selected = property;
		},
		save(){
			const data = {
				photo: this.photo,
				background: this.background,
				style: this.style,
				fields: this.fields,
				layout: this.layout,
				render: this.render
			}
			const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'untitled-' + this.render + '.json';
			document.body.appendChild(link);
			link.click();
			window.URL.revokeObjectURL(url);
			link.remove();
		},
		load(e, type = 'passport'){
			console.log("Loading digital passport from template...");
			var comp = this;
			var target = e.target;
			const file = target.files[0];
			if (!file)
			{
				console.log("File not found!");
				return;
			}
			const reader = new FileReader();
			reader.onload = function (event) {
				const fileContent = event.target.result;
				try {
					const jd = JSON.parse(fileContent);
					if(Array.isArray(jd.fields))
					{
						comp.fields = jd.fields;
						comp.background = jd.background;
						comp.photo = jd.photo;
						comp.style = jd.style;
						comp.layout = jd.layout;
						comp.render = jd.render;
						console.log("Success!");
					}
				} catch (error) {
					console.error("Error parsing JSON:", error);
				}
			};
			reader.readAsText(file);
		},
		rows(){
			var rm = 0;
			for(var f of this.fields)
			{
				if(f.row > rm) rm = f.row;
			}
			return rm;
		},
		prepareLayout(type)
		{
			// Default settings for all the documents
			let layout = [
				[
					["type","code","number"],
				]
			];

			if(type == "passport")
			{
				// Passport layout
				layout = [
					[
						["type","code","number"],
						["surname"],
						["names"],
						["nationality"],
						["date_of_birth","personal_number"],
						["sex","place_of_birth"],
						["date_of_issue","authority"],
						["date_of_expiry","signature"]
					]
				];
			}
			if(type == "visa")
			{
				layout = [
					[
						["date_of_issue|width:28","place_of_issue|width:48"],
						["date_of_expiry|width:28","purpose_of_visit|width:48"],
						["fullname"],
						["type|width:14","code|width:14","visa_number|width:25","entries|width:24"],
						["sex|width:14","nationality_code|width:14","number|width:25","duration|width:24"],
						["remarks"]
					]
				];
				this.style.variant = 'mrv-b';
			}
			if(type == "id-card")
			{
				layout = [
					[
						["date_of_birth|width:26","id-number|width:26"],
						["surname|width:52"],
						["names|width:52"],
						["sex|width:10","place_of_birth|width:42"],
						["date_of_issue|width:26","date_of_expiry|width:26"],
					],
					[
						["type|width:18","code|width:18","authority|width:45"],
						["height|width:18","skin-color|width:18","signature|width:45"],
						["blood_type|width:18","eye-color|width:18"]
					]
				];
				this.style.variant = 'cr80';
			}

			// Layout processing
			this.processLayout(layout)

			this.render = type;
		},
		parseLayoutMarker(marker)
		{
			var output = {
				width: 0,
				param: "null"
			};
			var params = marker.split("|");
			for(var param of params)
			{
				if(param.includes(":"))
				{
					output[param.split(":")[0]] = param.split(":")[1];

					if(param.split(":")[0] == "width") Number(output[param.split(":")[0]]);
				}
				else
				{
					output.param = param;
				}
			}
			return output;
		},
		processLayout(layout)
		{
			for(let page in layout)
			{
				for(let row in layout[page])
				{
					for(let col in layout[page][row])
					{
						let l = this.parseLayoutMarker(layout[page][row][col]);
						let o = this.get(l.param);
						if(l.width > 0) o.width = l.width;
						l.page = page;
						layout[page][row][col] = o;
					}
				}
			}
			console.log("Layout:");
			console.log(layout);
			this.layout = layout;
		},
		layout: [

		],
		fields: [
			{
				title:`Country Name`,
				value:`Undefined States of NullPointerException`,
				param:`countryname`,
				width: 86,
				setup:`text`,
				mandatory: true,
			},
			{
				title:`Document Type`,
				value:`Passport`,
				param:`document`,
				width: 86,
				setup:`text`,
			},
			{
				title:`Number of Entries`,
				value:`01`,
				param:`entries`,
				width: 13,
				setup:`text`,
			},
			{
				title:`Duration of Stay`,
				value:`90`,
				param:`duration`,
				width: 13,
				setup:`text`,
			},
			{
				title:`Purpose of Visit`,
				value:`TRAVEL`,
				param:`purpose_of_visit`,
				width: 13,
				setup:`text`,
			},
			{
				title:`Official Remarks`,
				value:``,
				param:`remarks`,
				width: 86,
				setup:`text`,
			},
			{
				title:`Blood Type`,
				value:`A(II)-`,
				param:`blood_type`,
				width: 86,
				setup:`text`,
			},
			{
				title:`Nationality Code`,
				value:`UTO`,
				param:`nationality_code`,
				width: 13,
				setup:`text`,
			},
			{
				title:`Type`,
				value:`P`,
				param:`type`,
				width: 15.2,
				setup:`text`,
				length: 2,
				mandatory: true,
			},
			{
				title:`Code`,
				value:`UTO`,
				param:`code`,
				width: 27.8,
				setup:`text`,
				length: 3,
				row: 1,
				mandatory: true,
			},
			{
				title:`Height`,
				value:`178`,
				param:`height`,
				width: 27.8,
				setup:`text`,
				length: 3,
				row: 1,
			},
			{
				title:`Eye Color`,
				value:`BROWN`,
				param:`eye-color`,
				width: 27.8,
				setup:[`BROWN`,`BLUE`,`RED`,`GREEN`,`BLACK`,`GRAY`,`PURPLE`],
				length: 3,
				row: 1,
			},
			{
				title:`Skin Color`,
				value:`WHITE`,
				param:`skin-color`,
				width: 27.8,
				setup:[`WHITE`,`BLACK`],
				length: 3,
				row: 1,
			},
			{
				title:`Passport Number`,
				value:`000000000`,
				param:`number`,
				width: 43,
				setup:`text`,
				length: 9,
				row: 1,
				mandatory: true,
			},
			{
				title:`ID Number`,
				value:`000000000`,
				param:`id-number`,
				width: 43,
				setup:`text`,
				length: 9,
				row: 1,
				mandatory: true,
			},
			{
				title:`Place of Issue`,
				value:`UTOPIA`,
				param:`place_of_issue`,
				width: 43,
				setup:`text`,
				length: 9,
				row: 1,
				mandatory: true,
			},
			{
				title:`Full name: Surname, Given Names`,
				value:`EICHENDORF, DAVID`,
				param:`fullname`,
				width: 86,
				setup:`text`,
				row: 2,
				mandatory: true,
			},
			{
				title:`Surname`,
				value:`EICHENDORF`,
				param:`surname`,
				width: 86,
				setup:`text`,
				row: 2,
				for: `*`,
				mandatory: true,
			},
			{
				title:`Given Names`,
				value:`DAVID`,
				param:`names`,
				width: 86,
				setup:`text`,
				shown: true,
				mandatory: true,
			},
			{
				title:`Nationality`,
				value:`UNKNOWN CITIZEN`,
				param:`nationality`,
				width: 86,
				setup:`text`,
				shown: true,
				mandatory: true,
			},
			{
				title:`Date of Birth`,
				value:`1999-04-25`,
				param:`date_of_birth`,
				width: 43,
				setup:`date`,
				format: `YYYY-MM-DD`,
				shown: true,
				mandatory: true,
			},
			{
				title:`Personal Number`,
				value:`000000000`,
				param:`personal_number`,
				width: 43,
				setup:`text`,
				mandatory: false,
			},
			{
				title:`Visa Number`,
				value:`000000000`,
				param:`visa_number`,
				width: 43,
				setup:`text`,
				mandatory: false,
			},
			{
				title:`Sex`,
				value:`M`,
				param:`sex`,
				width: 15.2,
				setup:[`M`,`F`,`N`],
				mandatory: true,
			},
			{
				title:`Place of Birth`,
				value:`MORDOR`,
				param:`place_of_birth`,
				width: 70.8,
				setup:`text`,
				mandatory: false,
			},
			{
				title:`Date of Issue`,
				value:`2022-11-27`,
				param:`date_of_issue`,
				width: 43,
				setup:`date`,
				format: `YYYY-MM-DD`,
				shown: true,
				mandatory: true,
			},
			{
				title:`Holder's signature`,
				value:``,
				param:`signature`,
				width: 43,
				setup:`image`,
				shown: true,
				mandatory: true,
			},
			{
				title:`Authority`,
				value:``,
				param:`authority`,
				width: 43,
				setup:`text`,
				shown: true,
				mandatory: true,
			},
			{
				title:`Date of Expiry`,
				value:`2032-11-27`,
				param:`date_of_expiry`,
				width: 43,
				setup:`date`,
				format: `YYYY-MM-DD`,
				shown: true,
				mandatory: true,
			}
		],
		get: function(param)
		{
			for(var f of this.fields)
			{
				if(param == f.param) return f;
			}
		},
		select: function(param)
		{
			// Checking document bound parameters first
			for(var page of this.layout)
			{
				for(var row of page)
				{
					for(var col of row)
					{
						if(param == col.param) return col.value;
					}
				}
			}

			// Checking other parameters
			for(var f of this.fields)
			{
				if(param == f.param) return f.value;
			}

			// Failsafe return
			return ``;
		},
		dateMRZ(date)
		{
			var d = date.split(/[\-\.]/g);
			return d[0].slice(-2) + d[1] + d[2];
		},
		checkDigit(input)
		{
			// Убираем все лишнее
			input =  input.toString().toUpperCase().replace(/[^A-Z0-9]/g,"0");

			// Считаем цифровые значения каждой буквы и вводим в массив
			var values = [];
			for(var char of input)
			{
				if (/[A-Z]/.test(char))
				{
					values.push(char.charCodeAt(0) - 55);
				}
				else
				{
					values.push(parseInt(char, 10));
				}
			}

			// Считаем помноженные значения массива
			var sum = 0;
			var multiplied = [];
			const weights = [7, 3, 1];
			for (let i = 0; i < values.length; i++)
			{
				var value = values[i] * weights[i % 3];
				multiplied.push(value);
				sum += value;
			}

			// Получаем сумму массива и возводим в модуль 10
			console.log(values);
			console.log(multiplied);
			console.log(sum);
			return sum.toString();
		},
		substrEnd: function(string,length,fill)
		{
			return this.substr(string,length,fill).padEnd(length, fill);
		},
		substr: function(string,length,fill)
		{
			string = string.toString();

			if(string.length > length)
			{
				string = string.substr(0,length);
			}

			return string;
		},
		substrStart: function(string,length,fill)
		{
			return this.substr(string,length,fill).padStart(length, fill);
		},
		getFile(id,callback)
		{
			console.log("collecting image..");
			var file = $(id).get(0).files[0];
 
	        if(file){
	            var reader = new FileReader();
	 
	            reader.onload = function(){
	                callback(reader.result);
	            }
	 
	            reader.readAsDataURL(file);
	        }
		},
		print()
		{
			const elementToPrint = document.getElementById("printable");
		  
			if (elementToPrint) {
				var printable = elementToPrint.innerHTML;
				printable = printable.replace("centered","");
			  const printWindow = window.open('', '_blank');
			  printWindow.document.write('<html><head><title>MRTD Print</title><link rel="stylesheet" type="text/css" href="main.css"><link rel="stylesheet" type="text/css" href="icao-9303.css"></head><body>');
			  printWindow.document.write(`<div class="printable">${printable}</div>`);
			  printWindow.document.write('</body></html>');
			  printWindow.document.close();
			  printWindow.onload = function () {
				printWindow.print();
			  };
			} else {
			  console.error('Element with the specified ID was not found.');
			}
		},
		generate: function()
		{
			var mrz = ['','',''];
			var chk = ['',''];

			if(this.render == "passport")
			{
				// MRZ 0
				var type = this.substrEnd(this.select("type"),2,"<");
				var code = this.substrEnd(this.select("code"),3,"<");
				var sn   = this.select("surname").replace(/ /g,"<");
				var name = this.select("names").replace(/ /g,"<");

				mrz[0] = type+code+sn+"<<"+name;
				mrz[0] =  this.substrEnd(mrz[0],44,"<");

				// MRZ 1
				var number = this.substrEnd(this.select("number"),9,"<");
				var chkn   = this.checkDigit(number).slice(-1);
				var birthd = this.dateMRZ(this.select("date_of_birth"));
				var chkb   = this.checkDigit(birthd).slice(-1);
				var sex    = this.select("sex");
				var expiry = this.dateMRZ(this.select("date_of_expiry"));
				var chke   = this.checkDigit(expiry).slice(-1);
				var person = this.substrEnd(this.select("personal_number"),14,"<");
				var chkp   = this.checkDigit(person).slice(-1);
				
				//build MRZ
				mrz[1] = this.substr(number+chkn+code+birthd+chkb+sex+expiry+chke+person,42,"<");
				var prompt = number+chkn+birthd+chkb+expiry+chke+person+chkp;				

				// checkigit final
				mrz[1] += chkp
				mrz[1] += this.checkDigit(prompt).slice(-1);
			}
			if(this.render == "visa")
			{
				// MRZ 0
				var type = this.substrEnd(this.select("type"),2,"<");
				var code = this.substrEnd(this.select("code"),3,"<");
				var sn   = this.select("surname").replace(/ /g,"<");
				var name = this.select("names").replace(/ /g,"<");
				var fullname = this.select("fullname").replace(/ /g,"<");
				
				if(fullname.includes(","))
				{
					mrz[0] = type+code+fullname.split(",")[0]+"<<"+fullname.split(",")[1];
				}
				else
				{
					mrz[0] = type+code+fullname;
				}
				mrz[0] = this.substrEnd(mrz[0],44,"<");

				// MRZ 1
				var number = this.substrEnd(this.select("number"),9,"<");
				var chkn   = this.checkDigit(number).slice(-1);
				var birthd = this.dateMRZ(this.select("date_of_birth"));
				var chkb   = this.checkDigit(birthd).slice(-1);
				var sex    = this.select("sex");
				var expiry = this.dateMRZ(this.select("date_of_expiry"));
				var chke   = this.checkDigit(expiry).slice(-1);
				var person = this.substrEnd(this.select("visa_number"),14,"<");
				var chkp   = this.checkDigit(person).slice(-1);
				var natcode= this.substrEnd(this.select("nationality_code"),3,"<");
				
				//build MRZ
				mrz[1] = this.substr(number+chkn+natcode+birthd+chkb+sex+expiry+chke+person,42,"<");
				var prompt = number+chkn+birthd+chkb+expiry+chke+person+chkp;				

				// checkigit final
				mrz[1] += chkp
				mrz[1] += this.checkDigit(prompt).slice(-1);
			}
			if(this.render == "id-card")
			{
				var type = this.substrEnd(this.select("type"),2,"<");
				var code = this.substrEnd(this.select("code"),3,"<");
				var sn   = this.select("surname").replace(/ /g,"<");
				var name = this.select("names").replace(/ /g,"<");
				var number = this.substrEnd(this.select("id-number"),9,"<");
				var chkn   = this.checkDigit(number).slice(-1);
				var birthd = this.dateMRZ(this.select("date_of_birth"));
				var chkb   = this.checkDigit(birthd).slice(-1);
				var sex    = this.select("sex");
				var expiry = this.dateMRZ(this.select("date_of_expiry"));
				var chke   = this.checkDigit(expiry).slice(-1);
				var person = this.substrEnd(this.select("personal_number"),14,"<");
				var chkp   = this.checkDigit(person).slice(-1);

				// MRZ 0
				mrz[0] = type+code+number+chkn;

				// MRZ 1
				mrz[1] = birthd+chkb + sex + expiry+chke + code;

				// CHECK DIGIT MRZ 1
				var total_check_digit = this.checkDigit(number+chkn+birthd+chkb+expiry+chke+person+chkp).slice(-1);

				// MRZ 2
				mrz[2] = sn + "<<" + name;


				mrz[0] =  this.substrEnd(mrz[0],30,"<");
				mrz[1] =  this.substrEnd(mrz[1],29,"<") + total_check_digit;
				mrz[2] =  this.substrEnd(mrz[2],30,"<");
			}

			return mrz;
		}
	}
});

root.createLayer();

