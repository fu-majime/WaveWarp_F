local WaveWarp_F = {}

-- define local function
local function script_path()
    return debug.getinfo(1).source:match("@?(.*[/\\])")
end

local function rot_mat(angle)
    return { math.cos(angle), -math.sin(angle), math.sin(angle), math.cos(angle) }
end
----

local GLShaderKit = require("GLShaderKit")

local shader_path = script_path().."WaveWarp_F.frag"

if GLShaderKit.isInitialized() then
    WaveWarp_F.WaveWarp_F = function(height, width, rot, period, shape, phase, mirror, fix, reload)

        if height == 0 or width == 0 then
            return
        end

        local _w, _h = obj.getpixel()

        local addX, addY = height * math.abs(math.sin(rot)), height * math.abs(math.cos(rot))
        local exParams = {
            [1] = {addY, addY, addX, addX},
            [2] = {1, 1, 1, 1},
            [3] = {1, 1, addX, addX},
            [4] = {addY, addY, 1, 1},
            [5] = {1, addY, addX, addX},
            [6] = {addY, 1, addX, addX},
            [7] = {addY, addY, addX, 1},
            [8] = {addY, addY, 1, addX}
        }
        
        local params = exParams[fix] or {addY, addY, addX, addX}
        obj.effect("領域拡張", "上", params[1], "下", params[2], "右", params[3], "左", params[4])

        local data, w, h = obj.getpixeldata()

        GLShaderKit.activate()
        GLShaderKit.setPlaneVertex(1)
        GLShaderKit.setShader(shader_path, reload)
        GLShaderKit.setFloat("resolution", w, h)
        GLShaderKit.setFloat("time", obj.time)
        GLShaderKit.setFloat("height", height)
        GLShaderKit.setFloat("width", width)
        local rMat = rot_mat(rot)
        GLShaderKit.setFloat("rot", rot)
        GLShaderKit.setMatrix("rot1", "2x2", true, rMat)
        GLShaderKit.setMatrix("rot2", "2x2", false, rMat)
        GLShaderKit.setFloat("period", period)
        GLShaderKit.setInt("shape", shape)
        GLShaderKit.setFloat("phase", phase)
        GLShaderKit.setInt("mirror", mirror and 1 or 0)
        GLShaderKit.setInt("fix", fix)
        GLShaderKit.setTexture2D(0, data, w, h)
        GLShaderKit.draw("TRIANGLES", data, w, h)

        GLShaderKit.deactivate()

        obj.putpixeldata(data)
    end
else
    WaveWarp_F.WaveWarp_F = function(height, width, rot, period, shape, phase, mirror, fix, reload)
        obj.setfont("MS UI Gothic", 30)
        obj.load("text", "WaveWarp_F is not available on this device.\nWaveWarp_Fはこのデバイスでは使用できません。")
        obj.draw()
    end
end

return WaveWarp_F