"use strict";
 class TritonAIRacerControl extends Viewer {
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

			if(field == "throttle") {
				this.fieldNodes[field][0].innerHTML = msg[field].throttle;
			}
			else if(field == "brake") {
				this.fieldNodes[field][0].innerHTML = msg[field].brake;
			}
			else if(field == "steering_openloop" || field == "steering_rad") {
				this.fieldNodes[field][0].innerHTML = msg[field].steer;
			}
		}

	 }
 }

TritonAIRacerControl.friendlyName = "RCS Race State Viewer";
TritonAIRacerControl.supportedTypes = [
	"tritonairacer_interfaces/msg/TritonAIRacerControl",
];

Viewer.registerViewer(TritonAIRacerControl);
