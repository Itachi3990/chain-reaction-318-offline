package com.crsp.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AiMove")
public class AiMovePlugin extends Plugin {

    @PluginMethod()
    public void makeMove(PluginCall call) {
        String stateStr = call.getString("stateStr");
        int rows = call.getInt("rows");
        int depth = call.getInt("depth");
        String heuristic = call.getString("heuristic");
        String playingFor = call.getString("playingFor");

        int move = ai.aiMove(stateStr, rows, depth, heuristic, playingFor);

        JSObject ret = new JSObject();
        ret.put("aiMove", move);
        call.resolve(ret);
    }
}