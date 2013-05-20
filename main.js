/*
 * Copyright (c) 2013 Florian Valence. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, Image, document */

define(function (require, exports, module) {
	"use strict";
	var COMMAND_ID = "getimage.getimage";

	// Brackets modules
	var EditorManager       = brackets.getModule("editor/EditorManager"),
		ProjectManager      = brackets.getModule("project/ProjectManager"),
		DocumentManager     = brackets.getModule("document/DocumentManager"),
		NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem,
		CommandManager      = brackets.getModule("command/CommandManager"),
		KeyBindingManager   = brackets.getModule("command/KeyBindingManager"),
		Dialogs             = brackets.getModule("widgets/Dialogs"),
		Strings             = brackets.getModule("strings");

	// local modules
	var mainDialog       = require("text!dialog.html");

	function selectAll($id) {
		/*document.getElementById(id).focus();
		document.getElementById(id).select();*/
		$id.focus().select();
		console.log($id);
	}
	$("textarea").focus(function () {
		// Check for the change
		if (this.value == this.defaultValue) {
			this.select();
		}
	});
	function getBase64Image(URL) {
		var imgee = new Image();
		imgee.src = URL;
		imgee.onload = function () {


			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0);


			var dataURL = canvas.toDataURL("image/png");

			console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
			var dataaa = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
			$(".modal-body").append("<textarea id='data' style='height:80px; width:100%'>" + dataaa + "</textarea>");
			selectAll($('#data'));
			$("#data").on('click', selectAll($('#data')));

		};
	}
//    test url    http://pages.github.com/images/scrcap-author.png


	function loadImage(imgUrl) {
		$(".modal-body").append("<div class='dialog-message'><br>Here is the image : <br><img class='sucked' style='max-width:560px; max-height:560px' src='" + imgUrl + "'><br>And now just copy that : <br></div>");
		getBase64Image(imgUrl);
	}

	function launchUrlDialog(imgUrl) {

		var $dlg,
			$title,
			$getUrlControl,
			dialogPromise;

		$dlg = $(mainDialog);
		Dialogs.showModalDialogUsingTemplate($dlg);
		// we implement our own OK button handler so we have
		// no interest in the returned promise

		// URL input
		$getUrlControl = $dlg.find(".get-url");

		// add OK button handler
		$dlg.one("click", ".dialog-button-ext", function (e) {
			var imgUrl = $getUrlControl.val();
			console.log("Sucking " + imgUrl);
			loadImage(imgUrl);
		});

	}

	CommandManager.register("Edit File", COMMAND_ID, launchUrlDialog);
	KeyBindingManager.addBinding(COMMAND_ID, "Alt-Shift-G");
});
