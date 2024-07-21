function redirectTeam() {
    let alert = document.getElementById('add_team_success');
    alert.style.display = "block";

    let team_name = document.getElementById('add_ticket_team_name').value;
    let team_members = document.getElementById('add_ticket_team_member').value;

    let id = localStorage.getItem('user_name');

    const request = {
        "content":{
            'team_name': `${team_name}`,
            'team_members': `${team_members}`,
            'created_by_name': `${id}`,
        }
    }
    console.log(request);
    // domo.post(`/domo/datastores/v1/collection/Ticket_Manager_Team_tb/documents/`, request); 

    setTimeout(() => {
        window.location.href = "user_index.html";
    }, 3000);
}


