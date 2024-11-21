package com.pubnub.custom.customizedchatapp

import android.os.Bundle
import android.util.Base64
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import com.pubnub.custom.customizedchatapp.ui.theme.CustomizedChatAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val configuration = applicationContext.getSharedPreferences("prefs.db", 0).getString("configuration", null)
        val testConfigAbc = "abc123"
        val testConfigTypingTrue = "eyJwdWJsaXNoS2V5IjoicHViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4Iiwic3Vic2NyaWJlS2V5Ijoic3ViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4IiwicHVibGljX2NoYW5uZWxzIjp0cnVlLCJncm91cF9jaGF0Ijp0cnVlLCJtZXNzYWdlX2hpc3RvcnkiOnRydWUsIm1lc3NhZ2VfcmVhY3Rpb25zIjp0cnVlLCJtZXNzYWdlX3JlYWRfcmVjZWlwdHMiOnRydWUsIm1lc3NhZ2VfdGhyZWFkcyI6ZmFsc2UsInR5cGluZ19pbmRpY2F0b3IiOnRydWUsInVzZXJfcHJlc2VuY2UiOnRydWUsIm1lc3NhZ2VfcXVvdGUiOmZhbHNlLCJtZXNzYWdlX3BpbiI6dHJ1ZSwibWVzc2FnZV9mb3J3YXJkIjpmYWxzZSwibWVzc2FnZV91bnJlYWRfY291bnQiOmZhbHNlLCJtZXNzYWdlX2VkaXRpbmciOmZhbHNlLCJtZXNzYWdlX2RlbGV0aW9uX3NvZnQiOmZhbHNlLCJtZW50aW9uX3VzZXIiOmZhbHNlLCJjaGFubmVsX3JlZmVyZW5jZXMiOmZhbHNlLCJ2aWV3X3VzZXJfcHJvZmlsZXMiOnRydWUsImVkaXRfdXNlcl9kZXRhaWxzIjpmYWxzZSwiZWRpdF9jaGFubmVsX2RldGFpbHMiOmZhbHNlLCJtZXNzYWdlX3NlYXJjaCI6ZmFsc2UsIm1lc3NhZ2Vfdm9pY2Vfbm90ZSI6ZmFsc2UsIm1lc3NhZ2Vfc2VuZF9maWxlIjpmYWxzZSwibWVzc2FnZV9zaG93X3VybF9wcmV2aWV3IjpmYWxzZSwibWVzc2FnZV9yZXBvcnQiOmZhbHNlLCJoYW5kbGVfYmFubmVkIjp0cnVlLCJzdXBwb3J0X3B1c2giOmZhbHNlLCJtZXNzYWdlX2VuY3J5cHRpb24iOmZhbHNlLCJzZW5kX3JlY2VpdmVfbWVzc2FnZXMiOnRydWV9"
        val testConfigTypingFalse = "eyJwdWJsaXNoS2V5IjoicHViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4Iiwic3Vic2NyaWJlS2V5Ijoic3ViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4IiwicHVibGljX2NoYW5uZWxzIjp0cnVlLCJncm91cF9jaGF0Ijp0cnVlLCJtZXNzYWdlX2hpc3RvcnkiOnRydWUsIm1lc3NhZ2VfcmVhY3Rpb25zIjp0cnVlLCJtZXNzYWdlX3JlYWRfcmVjZWlwdHMiOnRydWUsIm1lc3NhZ2VfdGhyZWFkcyI6ZmFsc2UsInR5cGluZ19pbmRpY2F0b3IiOmZhbHNlLCJ1c2VyX3ByZXNlbmNlIjp0cnVlLCJtZXNzYWdlX3F1b3RlIjpmYWxzZSwibWVzc2FnZV9waW4iOnRydWUsIm1lc3NhZ2VfZm9yd2FyZCI6ZmFsc2UsIm1lc3NhZ2VfdW5yZWFkX2NvdW50IjpmYWxzZSwibWVzc2FnZV9lZGl0aW5nIjpmYWxzZSwibWVzc2FnZV9kZWxldGlvbl9zb2Z0IjpmYWxzZSwibWVudGlvbl91c2VyIjpmYWxzZSwiY2hhbm5lbF9yZWZlcmVuY2VzIjpmYWxzZSwidmlld191c2VyX3Byb2ZpbGVzIjp0cnVlLCJlZGl0X3VzZXJfZGV0YWlscyI6ZmFsc2UsImVkaXRfY2hhbm5lbF9kZXRhaWxzIjpmYWxzZSwibWVzc2FnZV9zZWFyY2giOmZhbHNlLCJtZXNzYWdlX3ZvaWNlX25vdGUiOmZhbHNlLCJtZXNzYWdlX3NlbmRfZmlsZSI6ZmFsc2UsIm1lc3NhZ2Vfc2hvd191cmxfcHJldmlldyI6ZmFsc2UsIm1lc3NhZ2VfcmVwb3J0IjpmYWxzZSwiaGFuZGxlX2Jhbm5lZCI6dHJ1ZSwic3VwcG9ydF9wdXNoIjpmYWxzZSwibWVzc2FnZV9lbmNyeXB0aW9uIjpmYWxzZSwic2VuZF9yZWNlaXZlX21lc3NhZ2VzIjp0cnVlfQ=="
        val jsonConfiguration = decodeConfiguration(configuration)
        val buildConfiguration = convertToJson(Configuration.params)
        enableEdgeToEdge()
        setContent {
            CustomizedChatAppTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    //Greeting(
                    //    name = "Android",
                    //    modifier = Modifier.padding(innerPadding)
                    //)
                    //var typingIndicatorShown by remember { mutableStateOf("uninitialized") }
                    Column {
                        Text(text = "Is Appetize?: " + applicationContext.getSharedPreferences("prefs.db", 0).getBoolean("isAppetize", false), modifier = Modifier.padding(innerPadding))
                        Text(text = "Typing Indicator: " + (jsonConfiguration?.get("typing_indicator") ?: "Unspecified"), modifier = Modifier.padding(innerPadding))
                        Text(text = "Configuration: $jsonConfiguration", modifier = Modifier.padding(innerPadding))
                        Text(text = "Typing Indicator (Build): ${buildConfiguration?.get("typing_indicator")}", modifier = Modifier.padding(innerPadding))
                    }
                }
            }
        }
    }

    private fun decodeConfiguration(encodedConfiguration: String?): Map<String, JsonElement>? {

        if (encodedConfiguration == null)
        {
            Log.w("CCApp", "No Configuration provided")
            return null
        }
        try {
            val decodedConfiguration = String(Base64.decode(encodedConfiguration.toByteArray(), Base64.DEFAULT))
            return convertToJson(decodedConfiguration)
        }
        catch (e: Exception) {
            return null
        }
    }

    private fun convertToJson(config: String): Map<String, JsonElement>?
    {
        try {
            val jsonConfiguration: Map<String, JsonElement> = Json.parseToJsonElement(config).jsonObject
            val typingIndicator = jsonConfiguration["typing_indicator"]
            Log.d("CCApp", typingIndicator.toString())
            return jsonConfiguration
        }
        catch (e: Exception) {
            Log.e("CCApp", e.toString())
            return null
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    CustomizedChatAppTheme {
        Greeting("Android")
    }
}