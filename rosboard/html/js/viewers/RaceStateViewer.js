"use strict";
 class RaceStateViewer extends Viewer {
	/**
	 * Gets called when Viewer is first initialized.
	 * @override
	 **/
	 onCreate() {
		 this.viewerNode = $('<div></div>')
      			.css({'font-size': '11pt'})
      			.appendTo(this.card.content);

		this.viewerNodeFadeTimeout = null;

		this.fieldNodes = {};
		this.dataTable = $('<table></table>')
          		.addClass('mdl-data-table')
          		.addClass('mdl-js-data-table')
          		.css({'width': '100%', 'min-height': '30pt', 'table-layout': 'fixed' })
          		.appendTo(this.viewerNode);

	 	super.onCreate();
	 }

	 onData(msg) {
		this.card.title.text(msg._topic_name);

		for(let field in msg) {
			if(field[0] === "_") continue;
			if(field === "header") continue;
			
			if(!this.fieldNodes[field]) {
				let tr = $('<tr></tr>')
                			.appendTo(this.dataTable);
				$('<td></td>')
                			.addClass('mdl-data-table__cell--non-numeric')
                			.text(field)
                			.css({'width': '40%', 'font-weight': 'bold', 'overflow': 'hidden', 'text-overflow': 'ellipsis'})
                			.appendTo(tr);

				this.fieldNodes[field] = $('<td></td>')
                			.addClass('mdl-data-table__cell--non-numeric')
                			.addClass('monospace')
                			.css({'overflow': 'hidden', 'text-overflow': 'ellipsis'})
                			.appendTo(tr);
				let that = this;

			}

			if(msg[field].uuid) {
            			this.fieldNodes[field].text(msg[field].uuid.map((byte) => ((byte<16) ? "0": "") + (byte & 0xFF).toString(16)).join(''));
            			this.fieldNodes[field].css({"color": "#808080"});
            			continue;
        		}

			let flags = ['EMERGENCY_STOP', 'RED', 'YELLOW', 'GREEN', 'BLACK']
			let stages  = ['IN_GARAGE', 'IN_PIT', 'ON_GRID', 'IN_RACE', 'FINISH_RACE']

			if(field == "flag") {
				let race_flag = msg[field].race_flag;
				console.log(race_flag);
				this.fieldNodes[field][0].innerHTML = flags[race_flag];
			}
			else if(field == "stage") {
				console.log(msg[field].stage);
				let stage = msg[field].stage;
				this.fieldNodes[field][0].innerHTML = stages[stage];
			}
		}

	 }
 }

RaceStateViewer.friendlyName = "RCS Race State Viewer";
RaceStateViewer.supportedTypes = [
	"tritonairacer_interfaces/msg/RaceState",
];

Viewer.registerViewer(RaceStateViewer);
