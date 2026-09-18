// v0.1.0 




const Discord_RPC = require('discord-rpc');




const Client_Id = ' ';




const Activity_Config = {

    details : ' ',

    state : '',

    large_Image_Key : '',
    large_Image_Text: '',

    small_Image_Key : '',
    small_Image_Text: '',

    button_One_Label: '',
    button_One_Url : '',

    button_Two_Label: '',
    button_Two_Url : '',

};




const Update_Interval_Ms = 15_000;

const Rpc_Client = new Discord_RPC.Client({ transport: 'ipc' });
const Start_Time = new Date();
let Update_Timer = null;




async function Set_Activity() {

    if (!Rpc_Client) return;

    try {

        await Rpc_Client.setActivity({

            details : Activity_Config.details,

            state : Activity_Config.state,

            startTimestamp : Start_Time,

            largeImageKey : Activity_Config.large_Image_Key,
            largeImageText : Activity_Config.large_Image_Text,

            smallImageKey : Activity_Config.small_Image_Key,
            smallImageText : Activity_Config.small_Image_Text,

            instance : false,

            buttons: [

                { label: Activity_Config.button_One_Label, url: Activity_Config.button_One_Url },
                { label: Activity_Config.button_Two_Label, url: Activity_Config.button_Two_Url },
                
            ],

        });

    } catch (Set_Error) {

        console.error('Fail -', Set_Error.message);

    }

}




Rpc_Client.on('ready', () => {

    console.log(`Ready → ${Rpc_Client.user.username}`);

    Set_Activity();
    Update_Timer = setInterval(Set_Activity, Update_Interval_Ms);

});


Rpc_Client.on('error', (Rpc_Error) => {

    console.error('Fail -', Rpc_Error.message);

});


Rpc_Client.on('disconnected', () => {

    console.warn('Connection Lost');

    if (Update_Timer) {

        clearInterval(Update_Timer);
        Update_Timer = null;

    }

});


Rpc_Client.login({ clientId: Client_Id }).catch((Login_Error) => {

    console.error('Fail -', Login_Error.message);

    process.exit(1);

});


process.on('SIGINT', async () => {

    if (Update_Timer) clearInterval(Update_Timer);

    await Rpc_Client.destroy();

    process.exit(0);

});
