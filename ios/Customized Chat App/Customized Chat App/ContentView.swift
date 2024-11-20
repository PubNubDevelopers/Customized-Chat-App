//
//  ContentView.swift
//  Customized Chat App
//
//  Created by Darryn Campbell on 20/11/2024.
//

import SwiftUI



struct ContentView: View {
    @State var typingIndicatorShown: Bool = false
    let testConfigTypingTrue: String = "eyJwdWJsaXNoS2V5IjoicHViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4Iiwic3Vic2NyaWJlS2V5Ijoic3ViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4IiwicHVibGljX2NoYW5uZWxzIjp0cnVlLCJncm91cF9jaGF0Ijp0cnVlLCJtZXNzYWdlX2hpc3RvcnkiOnRydWUsIm1lc3NhZ2VfcmVhY3Rpb25zIjp0cnVlLCJtZXNzYWdlX3JlYWRfcmVjZWlwdHMiOnRydWUsIm1lc3NhZ2VfdGhyZWFkcyI6ZmFsc2UsInR5cGluZ19pbmRpY2F0b3IiOnRydWUsInVzZXJfcHJlc2VuY2UiOnRydWUsIm1lc3NhZ2VfcXVvdGUiOmZhbHNlLCJtZXNzYWdlX3BpbiI6dHJ1ZSwibWVzc2FnZV9mb3J3YXJkIjpmYWxzZSwibWVzc2FnZV91bnJlYWRfY291bnQiOmZhbHNlLCJtZXNzYWdlX2VkaXRpbmciOmZhbHNlLCJtZXNzYWdlX2RlbGV0aW9uX3NvZnQiOmZhbHNlLCJtZW50aW9uX3VzZXIiOmZhbHNlLCJjaGFubmVsX3JlZmVyZW5jZXMiOmZhbHNlLCJ2aWV3X3VzZXJfcHJvZmlsZXMiOnRydWUsImVkaXRfdXNlcl9kZXRhaWxzIjpmYWxzZSwiZWRpdF9jaGFubmVsX2RldGFpbHMiOmZhbHNlLCJtZXNzYWdlX3NlYXJjaCI6ZmFsc2UsIm1lc3NhZ2Vfdm9pY2Vfbm90ZSI6ZmFsc2UsIm1lc3NhZ2Vfc2VuZF9maWxlIjpmYWxzZSwibWVzc2FnZV9zaG93X3VybF9wcmV2aWV3IjpmYWxzZSwibWVzc2FnZV9yZXBvcnQiOmZhbHNlLCJoYW5kbGVfYmFubmVkIjp0cnVlLCJzdXBwb3J0X3B1c2giOmZhbHNlLCJtZXNzYWdlX2VuY3J5cHRpb24iOmZhbHNlLCJzZW5kX3JlY2VpdmVfbWVzc2FnZXMiOnRydWV9"
    let testConfigTypingFalse: String = "eyJwdWJsaXNoS2V5IjoicHViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4Iiwic3Vic2NyaWJlS2V5Ijoic3ViLWMtZTA4N2U1MzktYmIwYy00ZDE1LTkxYzktYWE4M2E1ZTk3NWY4IiwicHVibGljX2NoYW5uZWxzIjp0cnVlLCJncm91cF9jaGF0Ijp0cnVlLCJtZXNzYWdlX2hpc3RvcnkiOnRydWUsIm1lc3NhZ2VfcmVhY3Rpb25zIjp0cnVlLCJtZXNzYWdlX3JlYWRfcmVjZWlwdHMiOnRydWUsIm1lc3NhZ2VfdGhyZWFkcyI6ZmFsc2UsInR5cGluZ19pbmRpY2F0b3IiOmZhbHNlLCJ1c2VyX3ByZXNlbmNlIjp0cnVlLCJtZXNzYWdlX3F1b3RlIjpmYWxzZSwibWVzc2FnZV9waW4iOnRydWUsIm1lc3NhZ2VfZm9yd2FyZCI6ZmFsc2UsIm1lc3NhZ2VfdW5yZWFkX2NvdW50IjpmYWxzZSwibWVzc2FnZV9lZGl0aW5nIjpmYWxzZSwibWVzc2FnZV9kZWxldGlvbl9zb2Z0IjpmYWxzZSwibWVudGlvbl91c2VyIjpmYWxzZSwiY2hhbm5lbF9yZWZlcmVuY2VzIjpmYWxzZSwidmlld191c2VyX3Byb2ZpbGVzIjp0cnVlLCJlZGl0X3VzZXJfZGV0YWlscyI6ZmFsc2UsImVkaXRfY2hhbm5lbF9kZXRhaWxzIjpmYWxzZSwibWVzc2FnZV9zZWFyY2giOmZhbHNlLCJtZXNzYWdlX3ZvaWNlX25vdGUiOmZhbHNlLCJtZXNzYWdlX3NlbmRfZmlsZSI6ZmFsc2UsIm1lc3NhZ2Vfc2hvd191cmxfcHJldmlldyI6ZmFsc2UsIm1lc3NhZ2VfcmVwb3J0IjpmYWxzZSwiaGFuZGxlX2Jhbm5lZCI6dHJ1ZSwic3VwcG9ydF9wdXNoIjpmYWxzZSwibWVzc2FnZV9lbmNyeXB0aW9uIjpmYWxzZSwic2VuZF9yZWNlaXZlX21lc3NhZ2VzIjp0cnVlfQ=="
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
            Text(UserDefaults.standard.bool(forKey: "isAppetize") ? "Running in Appetize" : "Not running in Appetize")
            Text(UserDefaults.standard.string(forKey: "configuration") ?? "Configuration not specified")
            Text("Typing Indicator Shown: " + (typingIndicatorShown ? "Yes" : "No"))
        }
        .padding()
        .onAppear {self.testing()}
    }
    
    func testing() {
        let encodedConfiguration = UserDefaults.standard.string(forKey: "configuration") ?? ""
        if (encodedConfiguration == "")
        {
            debugPrint("Configuration Not Specified")
            return
        }
        var decodedString = ""
        if let decodedData = Data(base64Encoded: encodedConfiguration) {
            decodedString = String(data: decodedData, encoding: .utf8)!
        }
        debugPrint(decodedString)
        do {
            let data = Data(decodedString.utf8)
            debugPrint(data)
            if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                //debugPrint(json)
                //debugPrint(json["typing_indicator"] ?? -1)
                //debugPrint(json["typing_indicator2"] ?? -1)
                //let configTypingIndicator : Any? = json["typing_indicator"]
                //if configTypingIndicator == 1 {
                //    typingIndicatorShown = true
                //}
                if let configTypingIndicator = json["typing_indicator"] as? Int {
                    debugPrint(configTypingIndicator)
                    if (configTypingIndicator == 1) {
                        typingIndicatorShown = true
                    }
                }
            }
        } catch let error as NSError {
            print("Error parsing JSON: \(error)")
        }
    }
}

#Preview {
    ContentView()
}
