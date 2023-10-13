(function(modules) {
    var registeredModules = {};

    function requireModule(id) {
        if (registeredModules[id]) {
            return registeredModules[id].exports;
        }

        var module = registeredModules[id] = {
            i: id,
            l: false,
            exports: {}
        };

        modules[id].call(module.exports, module, module.exports, requireModule);
        module.l = true;

        return module.exports;
    }

    requireModule.m = modules;
    requireModule.c = registeredModules;
    requireModule.d = function(target, name, getter) {
        if (!requireModule.o(target, name)) {
            Object.defineProperty(target, name, {
                enumerable: true,
                get: getter
            });
        }
    };

    requireModule.r = function(target) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(target, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(target, '__esModule', { value: true });
    };

    requireModule.t = function(value, mode) {
        if (mode & 1) value = requireModule(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
        
        var ns = Object.create(null);
        requireModule.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        
        if (mode & 2 && typeof value != 'string') {
            for (var key in value) {
                requireModule.d(ns, key, function(key) { return value[key]; }.bind(null, key));
            }
        }
        
        return ns;
    };

    requireModule.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() { return module.default; } : function getModuleExports() { return module; };
        requireModule.d(getter, 'a', getter);
        return getter;
    };

    requireModule.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };

    requireModule.p = "";

    return requireModule(requireModule.s = 0);
})([
    function(module, exports) {
        function toShadowString(e) {
            var radius = toPixelValue(e.value.radius.measure <= 0 ? 0 : e.value.radius.measure);
            var offsetX = toPixelValue(e.value.x.measure);
            var offsetY = toPixelValue(e.value.y.measure);
            var spread = toPixelValue(e.value.spread.measure);
            
            var color = e.value.color.a === 0 
                ? `rgb(${e.value.color.r},${e.value.color.g},${e.value.color.b})`
                : `rgba(${e.value.color.r},${e.value.color.g},${e.value.color.b},${Math.round(e.value.color.a / 255 * 100) / 100})`;

            return `${e.value.type === "Inner" ? "inset " : ""}${offsetX} ${offsetY} ${radius} ${spread} ${color}`;
        }

        function toPixelValue(value) {
            return value === 0 ? "" + value : value + "px";
        }

        // Pulsar.registerFunction("readableVariableName", function(e, r, n) {
        //     const pathParts = [...r.path];
        //     if (!r.isRoot || !r.isNonVirtualRoot) {
        //         pathParts.push(r.name);
        //     }
        //     pathParts.push(e.name);

        //     if (n && n.length > 0) {
        //         pathParts.unshift(n);
        //     }

        //     let result = pathParts.join(" ");
        //     result = result.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, group1) => group1.toUpperCase());
        //     result = result.replace(/[^a-zA-Z0-9_-]/g, "_");

        //     if (/^\d/.test(result)) {
        //         result = "_" + result;
        //     }

        //     return result;
        // });


        Pulsar.registerFunction("readableVariableName", function(e, r, n) {
            const pathParts = [...r.path];
        
            // Push the name only if it's not the root or non-virtual root
            if (!r.isRoot || !r.isNonVirtualRoot) {
                pathParts.push(r.name);
            }
            pathParts.push(e.name);
        
            // Add the prefix if provided (n)
            if (n && n.length > 0) {
                pathParts.unshift(n);
            }
        
            // Join all parts with "-"
            let result = pathParts.join("-").toLowerCase();
        
            // Convert non-alphanumeric characters to hyphens and camelCase sections to hyphenated
            result = result.replace(/[^a-zA-Z0-9]+(.)/g, (match, group1) => "-" + group1.toLowerCase());
        
            // Replace any non-alphanumeric character (except for hyphens) with underscores
            result = result.replace(/[^a-zA-Z0-9_-]/g, "_");
        
            // If the result starts with a number, prepend with an underscore
            if (/^\d/.test(result)) {
                result = "_" + result;
            }
        
            return result;
        });

        
        Pulsar.registerFunction("findAliases", function(e, r) {
            let matches = r.filter(item => item.value.referencedToken && item.value.referencedToken.id === e.id);
            for (const match of matches) {
                matches = matches.concat(e(match, r));
            }
            return matches;
        });

        Pulsar.registerFunction("gradientAngle", function(e, r) {
            var deltaY = r.y - e.y;
            var deltaX = r.x - e.x;
            var angle = 180 * Math.atan2(deltaY, deltaX) / Math.PI;
            return (angle + 90 < 0 ? 360 + angle : angle) % 360;
        });

        Pulsar.registerPayload("behavior", {
            colorTokenPrefix: "color",
            borderTokenPrefix: "border",
            gradientTokenPrefix: "gradient",
            measureTokenPrefix: "measure",
            shadowTokenPrefix: "shadow",
            typographyTokenPrefix: "typography"
        });

        Pulsar.registerFunction("shadowDescription", function(e) {
            let result = "transparent";
            if (e.shadowLayers) {
                result = e.shadowLayers.reverse().map(toShadowString).join(", ");
                return result !== null ? result : "";
            }
            return toShadowString(e);
        });
    }
]);
