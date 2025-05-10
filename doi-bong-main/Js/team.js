function searchTeam() {
    let input = document.getElementById("searchTeam").value.toLowerCase();
    let teams = document.getElementById("teamList").getElementsByClassName("card");

    for (let i = 0; i < teams.length; i++) {
        let teamName = teams[i].getElementsByClassName("card-title")[0].innerText.toLowerCase();
        teams[i].style.display = teamName.includes(input) ? "" : "none";
    }
}

function showTeamMembers(teamId) {
    let membersList = document.getElementById("membersList");
    membersList.innerHTML = "";

    let members = teamId === "team1" ? [
        {name: "Nguyễn Văn A", number: "10", position: "Tiền đạo"},
        {name: "Trần Thị B", number: "5", position: "Hậu vệ"}
    ] : [];

    members.forEach(member => {
        let memberCard = document.createElement("div");
        memberCard.classList.add("member-card");

        memberCard.innerHTML = `
            <div>
                <h6>${member.name}</h6>
                <p>Số áo: ${member.number} | Vị trí: ${member.position}</p>
            </div>
        `;

        membersList.appendChild(memberCard);
    });

    $('#membersModal').modal('show');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function() {
            $('#membersModal').modal('hide');
        });
    });
});