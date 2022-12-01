function preview(evt) {
	document.querySelector(".previewWrap").innerHTML ="";
	if (evt.target.files) {
		for (let i = 0; i < evt.target.files.length; i++) {
			let reader = new FileReader();
			reader.readAsDataURL(evt.target.files[i]);
			reader.onload = function(rst){
				const img = document.createElement("img");
				img.src = rst.target.result;
				document.querySelector(".previewWrap").appendChild(img);
			}
		}
	}
}

async function sendAddReq(evt) {
	let targetId = evt.target.dataset.targetid;
	let message = document.querySelector('.commentWrite').value;
	console.log(targetId, message);
	const data = { targetId, message}
	let response = await fetch('/api/comment', {
		method: 'post',
		body: JSON.stringify(data),
		headers: {"Content-type" : "application/json"}
	})
	let result = await response.json();
	if(result.success) {
		let comment = result.comment;
		let lastComment = comment.reverse()[0];
		document.querySelector('.cnt').innerHTML = comment.length;
		let html = `
			<div class="row comment">
				<div>
					<img src="${lastComment.commneterImage}" alt="${lastComment.commenterId} image" class="userProfileImg">
					</div>
				<div class="grow1">
					<div>
						<span class="commenterId">${lastComment.commenterId}</span>
						<sapn class="createAt">${lastComment.createdAt.toLocaleString()}</sapn>
					</div>
					<div class="commnetMessage">${lastComment.commnetMessage}</div>
				</div>
			</div>
		`
		document.querySelector('.commentsList').insertAdjacentHTML(
			'beforeend', html
		);
	}
}