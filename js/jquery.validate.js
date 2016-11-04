(function(b) {
    b.extend({metadata: {defaults: {type: "class",name: "metadata",cre: /({.*})/,single: "metadata"},setType: function(a, c) {
                this.defaults.type = a;
                this.defaults.name = c
            },get: function(a, c) {
                var d = b.extend({}, this.defaults, c);
                if (!d.single.length)
                    d.single = "metadata";
                var e = b.data(a, d.single);
                if (e)
                    return e;
                e = "{}";
                if (d.type == "class") {
                    var f = d.cre.exec(a.className);
                    f && (e = f[1])
                } else if (d.type == "elem") {
                    if (!a.getElementsByTagName)
                        return;
                    f = a.getElementsByTagName(d.name);
                    f.length && (e = b.trim(f[0].innerHTML))
                } else
                    a.getAttribute != 
                    void 0 && (f = a.getAttribute(d.name)) && (e = f);
                e.indexOf("{") < 0 && (e = "{" + e + "}");
            //    e = eval("(" + e + ")");
			e = $.parseJSON(e);
                b.data(a, d.single, e);
                return e
            }}});
    b.fn.metadata = function(a) {
        return b.metadata.get(this[0], a)
    };
    b.extend(b.fn, {validate: function(a) {
            if (this.length) {
                var c = b.data(this[0], "validator");
                if (c)
                    return c;
                c = new b.validator(a, this[0]);
                b.data(this[0], "validator", c);
                c.settings.onsubmit && (this.find("input, button").filter(".cancel").click(function() {
                    c.cancelSubmit = !0
                }), c.settings.submitHandler && this.find("input, button").filter(":submit").click(function() {
                    c.submitButton = 
                    this
                }), this.submit(function(a) {
                    function e() {
                        if (c.settings.submitHandler) {
                            if (c.submitButton)
                                var a = b("<input type='hidden'/>").attr("name", c.submitButton.name).val(c.submitButton.value).appendTo(c.currentForm);
                            c.settings.submitHandler.call(c, c.currentForm);
                            c.submitButton && a.remove();
                            return !1
                        }
                        return !0
                    }
                    c.settings.debug && a.preventDefault();
                    if (c.cancelSubmit)
                        return c.cancelSubmit = !1, e();
                    if (c.form()) {
                        if (c.pendingRequest)
                            return c.formSubmitted = !0, !1;
                        return e()
                    } else
                        return c.focusInvalid(), !1
                }));
                return c
            } else
                a && 
                a.debug && window.console && console.warn("nothing selected, can't validate, returning nothing")
        },valid: function() {
            if (b(this[0]).is("form"))
                return this.validate().form();
            else {
                var a = !0, c = b(this[0].form).validate();
                this.each(function() {
                    a &= c.element(this)
                });
                return a
            }
        },removeAttrs: function(a) {
            var c = {}, d = this;
            b.each(a.split(/\s/), function(a, b) {
                c[b] = d.attr(b);
                d.removeAttr(b)
            });
            return c
        },rules: function(a, c) {
            var d = this[0];
            if (a) {
                var e = b.data(d.form, "validator").settings, f = e.rules, g = b.validator.staticRules(d);
                switch (a) {
                    case "add":
                        b.extend(g, b.validator.normalizeRule(c));
                        f[d.name] = g;
                        c.messages && (e.messages[d.name] = b.extend(e.messages[d.name], c.messages));
                        break;
                    case "remove":
                        if (!c)
                            return delete f[d.name], g;
                        var i = {};
                        b.each(c.split(/\s/), function(a, c) {
                            i[c] = g[c];
                            delete g[c]
                        });
                        return i
                }
            }
            d = b.validator.normalizeRules(b.extend({}, b.validator.metadataRules(d), b.validator.classRules(d), b.validator.attributeRules(d), b.validator.staticRules(d)), d);
            if (d.required)
                e = d.required, delete d.required, d = b.extend({required: e}, 
                d);
            return d
        }});
    b.extend(b.expr[":"], {blank: function(a) {
            return !b.trim("" + a.value)
        },filled: function(a) {
            return !!b.trim("" + a.value)
        },unchecked: function(a) {
            return !a.checked
        }});
    b.validator = function(a, c) {
        this.settings = b.extend({}, b.validator.defaults, a);
        this.currentForm = c;
        this.init()
    };
    b.validator.format = function(a, c) {
        if (arguments.length == 1)
            return function() {
                var c = b.makeArray(arguments);
                c.unshift(a);
                return b.validator.format.apply(this, c)
            };
        arguments.length > 2 && c.constructor != Array && (c = b.makeArray(arguments).slice(1));
        c.constructor != Array && (c = [c]);
        b.each(c, function(c, b) {
            a = a.replace(RegExp("\\{" + c + "\\}", "g"), b)
        });
        return a
    };
    b.extend(b.validator, {defaults: {messages: {},groups: {},rules: {},errorClass: "fv-error",validClass: "fv-valid",errorElement: "label",showFormTip: !0,focusInvalid: !0,errorContainer: b([]),errorLabelContainer: b([]),onsubmit: !0,ignore: [],ignoreTitle: !1,onfocusin: function(a) {
                this.lastActive = a;
                this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, 
                a, this.settings.errorClass, this.settings.validClass), this.errorsFor(a).hide())
            },onfocusout: function(a) {
                !this.checkable(a) && (a.name in this.submitted || !this.optional(a)) && this.element(a)
            },onkeyup: function(a) {
                (a.name in this.submitted || a == this.lastElement) && this.element(a)
            },onclick: function(a) {
                a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
            },highlight: function(a, c, d) {
                b(a).addClass(c).removeClass(d)
            },unhighlight: function(a, c, d) {
                b(a).removeClass(c).addClass(d)
            }},
        setDefaults: function(a) {
            b.extend(b.validator.defaults, a)
        },messages: {required: "This field is required.",remote: "Please fix this field.",email: "Please enter a valid email address.",url: "Please enter a valid URL.",date: "Please enter a valid date.",dateISO: "Please enter a valid date (ISO).",number: "Please enter a valid number.",digits: "Please enter only digits.",creditcard: "Please enter a valid credit card number.",equalTo: "Please enter the same value again.",accept: "Please enter a value with a valid extension.",
            maxlength: b.validator.format("Please enter no more than {0} characters."),minlength: b.validator.format("Please enter at least {0} characters."),rangelength: b.validator.format("Please enter a value between {0} and {1} characters long."),range: b.validator.format("Please enter a value between {0} and {1}."),max: b.validator.format("Please enter a value less than or equal to {0}."),min: b.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges: !1,prototype: {init: function() {
                function a(a) {
                    var c = 
                    b.data(this[0].form, "validator");
                    c.settings["on" + a.type] && c.settings["on" + a.type].call(c, this[0])
                }
                this.labelContainer = b(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || b(this.currentForm);
                this.containers = b(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();
                var c = this.groups = {};
                b.each(this.settings.groups, function(a, d) {
                    b.each(d.split(/\s/), 
                    function(b, d) {
                        c[d] = a
                    })
                });
                var d = this.settings.rules;
                b.each(d, function(a, c) {
                    d[a] = b.validator.normalizeRule(c)
                });
                b(this.currentForm).delegate("focusin focusout keyup", ":text, :password, :file, select, textarea", a).delegate("click", ":radio, :checkbox, select, option", a);
                this.settings.invalidHandler && b(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
            },form: function() {
                this.checkForm();
                b.extend(this.submitted, this.errorMap);
                this.invalid = b.extend({}, this.errorMap);
                this.valid() || 
                b(this.currentForm).triggerHandler("invalid-form", [this]);
                this.showErrors();
                return this.valid()
            },checkForm: function() {
                this.prepareForm();
                for (var a = 0, c = this.currentElements = this.elements(); c[a]; a++)
                    this.check(c[a]);
                return this.valid()
            },element: function(a) {
                this.lastElement = a = this.clean(a);
                this.prepareElement(a);
                this.currentElements = b(a);
                var c = this.check(a);
                c ? delete this.invalid[a.name] : this.invalid[a.name] = !0;
                if (!this.numberOfInvalids())
                    this.toHide = this.toHide.add(this.containers);
                this.showErrors();
                return c
            },showErrors: function(a) {
                if (a) {
                    b.extend(this.errorMap, a);
                    this.errorList = [];
                    for (var c in a)
                        this.errorList.push({message: a[c],element: this.findByName(c)[0]});
                    this.successList = b.grep(this.successList, function(c) {
                        return !(c.name in a)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },resetForm: function() {
                b.fn.resetForm && b(this.currentForm).resetForm();
                this.submitted = {};
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass)
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },objectLength: function(a) {
                var c = 0, b;
                for (b in a)
                    c++;
                return c
            },hideErrors: function() {
                this.addWrapper(this.toHide).hide();
                this.settings.showFormTip && this.hideFormTip()
            },valid: function() {
                return this.size() == 0
            },size: function() {
                return this.errorList.length
            },focusInvalid: function() {
                if (this.settings.focusInvalid)
                    try {
                        b(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus()
                    } catch (a) {
                    }
            },findLastActive: function() {
                var a = 
                this.lastActive;
                return a && b.grep(this.errorList, function(c) {
                    return c.element.name == a.name
                }).length == 1 && a
            },elements: function() {
                var a = this, c = {};
                return b([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
                    !this.name && a.settings.debug && window.console && console.error("%o has no name assigned", this);
                    if (this.name in c || !a.objectLength(b(this).rules()))
                        return !1;
                    return c[this.name] = !0
                })
            },clean: function(a) {
                return b(a)[0]
            },
            errors: function() {
                return b(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext)
            },reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = b([]);
                this.toHide = b([]);
                this.currentElements = b([])
            },prepareForm: function() {
                this.reset();
                this.toHide = this.errors().add(this.containers)
            },prepareElement: function(a) {
                this.reset();
                this.toHide = this.errorsFor(a)
            },check: function(a) {
                a = this.clean(a);
                this.checkable(a) && (a = this.findByName(a.name)[0]);
                var c = b(a).rules(), d = !1;
                for (method in c) {
                    var e = {method: method,parameters: c[method]};
                    try {
                        var f = b.validator.methods[method].call(this, a.value.replace(/\r/g, ""), a, e.parameters);
                        if (f == "dependency-mismatch")
                            d = !0;
                        else {
                            d = !1;
                            if (f == "pending") {
                                this.toHide = this.toHide.not(this.errorsFor(a));
                                return
                            }
                            if (!f)
                                return this.formatAndAdd(a, e), !1
                        }
                    } catch (g) {
                        throw this.settings.debug && window.console && console.log("exception occured when checking element " + a.id + ", check the '" + e.method + "' method", g), g;
                    }
                }
                if (!d)
                    return this.objectLength(c) && this.successList.push(a), 
                    !0
            },customMetaMessage: function(a, c) {
                if (b.metadata) {
                    var d = this.settings.meta ? b(a).metadata()[this.settings.meta] : b(a).metadata();
                    return d && d.messages && d.messages[c]
                }
            },customMessage: function(a, c) {
                var b = this.settings.messages[a];
                return b && (b.constructor == String ? b : b[c])
            },findDefined: function() {
                for (var a = 0; a < arguments.length; a++)
                    if (arguments[a] !== void 0)
                        return arguments[a]
            },defaultMessage: function(a, c) {
                return this.findDefined(this.customMessage(a.name, c), this.customMetaMessage(a, c), !this.settings.ignoreTitle && 
                a.title || void 0, b.validator.messages[c], "<strong>Warning: No message defined for " + a.name + "</strong>")
            },formatAndAdd: function(a, c) {
                var b = this.defaultMessage(a, c.method), e = /\$?\{(\d+)\}/g;
                typeof b == "function" ? b = b.call(this, c.parameters, a) : e.test(b) && (b = jQuery.format(b.replace(e, "{$1}"), c.parameters));
                this.errorList.push({message: b,element: a});
                this.errorMap[a.name] = b;
                this.submitted[a.name] = b
            },addWrapper: function(a) {
                this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper)));
                return a
            },defaultShowErrors: function() {
                for (var a = 
                0; this.errorList[a]; a++) {
                    var b = this.errorList[a];
                    this.settings.highlight && this.settings.highlight.call(this, b.element, this.settings.errorClass, this.settings.validClass);
                    this.showLabel(b.element, b.message)
                }
                if (this.errorList.length)
                    this.toShow = this.toShow.add(this.containers);
                if (this.settings.success)
                    for (a = 0; this.successList[a]; a++)
                        this.showLabel(this.successList[a]);
                if (this.settings.unhighlight) {
                    a = 0;
                    for (b = this.validElements(); b[a]; a++)
                        this.settings.unhighlight.call(this, b[a], this.settings.errorClass, 
                        this.settings.validClass)
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show()
            },validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },invalidElements: function() {
                return b(this.errorList).map(function() {
                    return this.element
                })
            },showLabel: function(a, c) {
                var d = this.errorsFor(a);
                if (d.length)
                    d.removeClass().addClass(this.settings.errorClass), d.attr("generated") && d.html(c), this.settings.showFormTip && d.html("");
                else {
                    d = b("<" + this.settings.errorElement + 
                    "/>").attr({"for": this.idOrName(a),generated: !0}).addClass(this.settings.errorClass).html(c || "");
                    this.settings.showFormTip && d.html("");
                    this.settings.wrapper && (d = d.hide().show().wrap("<" + this.settings.wrapper + "/>").parent());
                    if (!this.labelContainer.append(d).length)
                        if (this.settings.errorPlacement)
                            this.settings.errorPlacement(d, b(a));
                        else if (this.checkable(a)) {
                            var e = b(":" + a.type + "[name='" + a.name + "']:last");
                            d.appendTo(e.parent());
                            e = null
                        } else
                            d.insertAfter(a);
                    this.settings.showFormTip && this.createFormTip()
                }
                if (this.settings.showFormTip) {
                    var f = 
                    this;
                    b(a).hover(function() {
                        f.showFormTip(d, a, c)
                    }, function() {
                        f.hideFormTip()
                    });
                    b(d).hover(function() {
                        f.showFormTip(d, a, c)
                    }, function() {
                        f.hideFormTip()
                    })
                }
                !c && this.settings.success && (d.text(""), typeof this.settings.success == "string" ? d.addClass(this.settings.success) : this.settings.success(d));
                this.toShow = this.toShow.add(d)
            },createFormTip: function() {
                if (!document.getElementById("_formValidateTip")) {
                    var a = b("<div/>");
                    b(document.body).append(a);
                    a.attr("id", "_formValidateTip").addClass("form-validate-tip tip-left");
                    a.html('<div class="fv-tip-coner"></div><div class="fv-tip-l"></div><div id="_formValidateMsg" class="fv-tip-r"></div>')
                }
            },showFormTip: function(a, c, d) {
                if (a.css("display") != "none") {
                    a = a.offset();
                    c = b("#_formValidateTip");
                    b("#_formValidateMsg").html(d || "");
                    var d = c.width(), e = b(window).width();
                    a.left + d + 20 > e ? (a.left = a.left - d + 15, c.removeClass("tip-left").addClass("tip-right")) : c.removeClass("tip-right").addClass("tip-left");
                    c.css({left: a.left,top: a.top + 16}).show()
                }
            },hideFormTip: function() {
                b("#_formValidateTip").hide();
                b("#_formValidateMsg").html("")
            },errorsFor: function(a) {
                var c = this.idOrName(a);
                return this.errors().filter(function() {
                    return b(this).attr("for") == c
                })
            },idOrName: function(a) {
                return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
            },checkable: function(a) {
                return /radio|checkbox/i.test(a.type)
            },findByName: function(a) {
                var c = this.currentForm;
                return b(document.getElementsByName(a)).map(function(b, e) {
                    return e.form == c && e.name == a && e || null
                })
            },getLength: function(a, c) {
                switch (c.nodeName.toLowerCase()) {
                    case "select":
                        return b("option:selected", 
                        c).length;
                    case "input":
                        if (this.checkable(c))
                            return this.findByName(c.name).filter(":checked").length
                }
                return a.length
            },depend: function(a, b) {
                return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
            },dependTypes: {"boolean": function(a) {
                    return a
                },string: function(a, c) {
                    return !!b(a, c.form).length
                },"function": function(a, b) {
                    return a(b)
                }},optional: function(a) {
                return !b.validator.methods.required.call(this, b.trim(a.value), a) && "dependency-mismatch"
            },startRequest: function(a) {
                this.pending[a.name] || (this.pendingRequest++, 
                this.pending[a.name] = !0)
            },stopRequest: function(a, c) {
                this.pendingRequest--;
                if (this.pendingRequest < 0)
                    this.pendingRequest = 0;
                delete this.pending[a.name];
                if (c && this.pendingRequest == 0 && this.formSubmitted && this.form())
                    b(this.currentForm).submit(), this.formSubmitted = !1;
                else if (!c && this.pendingRequest == 0 && this.formSubmitted)
                    b(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1
            },previousValue: function(a) {
                return b.data(a, "previousValue") || b.data(a, "previousValue", {old: null,valid: !0,
                    message: this.defaultMessage(a, "remote")})
            }},classRuleSettings: {required: {required: !0},email: {email: !0},url: {url: !0},date: {date: !0},dateISO: {dateISO: !0},dateDE: {dateDE: !0},number: {number: !0},numberDE: {numberDE: !0},digits: {digits: !0},creditcard: {creditcard: !0}},addClassRules: function(a, c) {
            a.constructor == String ? this.classRuleSettings[a] = c : b.extend(this.classRuleSettings, a)
        },classRules: function(a) {
            var c = {};
            (a = b(a).attr("class")) && b.each(a.split(" "), function() {
                this in b.validator.classRuleSettings && b.extend(c, 
                b.validator.classRuleSettings[this])
            });
            return c
        },attributeRules: function(a) {
            var c = {}, a = b(a);
            for (method in b.validator.methods) {
                var d = a.attr(method);
                d && (c[method] = d)
            }
            c.maxlength && /-1|2147483647|524288/.test(c.maxlength) && delete c.maxlength;
            return c
        },metadataRules: function(a) {
            if (!b.metadata)
                return {};
            var c = b.data(a.form, "validator").settings.meta;
            return c ? b(a).metadata()[c] : b(a).metadata()
        },staticRules: function(a) {
            var c = {}, d = b.data(a.form, "validator");
            d.settings.rules && (c = b.validator.normalizeRule(d.settings.rules[a.name]) || 
            {});
            return c
        },normalizeRules: function(a, c) {
            b.each(a, function(d, e) {
                if (e === !1)
                    delete a[d];
                else if (e.param || e.depends) {
                    var f = !0;
                    switch (typeof e.depends) {
                        case "string":
                            f = !!b(e.depends, c.form).length;
                            break;
                        case "function":
                            f = e.depends.call(c, c)
                    }
                    f ? a[d] = e.param !== void 0 ? e.param : !0 : delete a[d]
                }
            });
            b.each(a, function(d, e) {
                a[d] = b.isFunction(e) ? e(c) : e
            });
            b.each(["minlength", "maxlength", "min", "max"], function() {
                a[this] && (a[this] = Number(a[this]))
            });
            b.each(["rangelength", "range"], function() {
                a[this] && (a[this] = [Number(a[this][0]), 
                    Number(a[this][1])])
            });
            if (b.validator.autoCreateRanges) {
                if (a.min && a.max)
                    a.range = [a.min, a.max], delete a.min, delete a.max;
                if (a.minlength && a.maxlength)
                    a.rangelength = [a.minlength, a.maxlength], delete a.minlength, delete a.maxlength
            }
            a.messages && delete a.messages;
            return a
        },normalizeRule: function(a) {
            if (typeof a == "string") {
                var c = {};
                b.each(a.split(/\s/), function() {
                    c[this] = !0
                });
                a = c
            }
            return a
        },addMethod: function(a, c, d) {
            b.validator.methods[a] = c;
            b.validator.messages[a] = d != void 0 ? d : b.validator.messages[a];
            c.length < 
            3 && b.validator.addClassRules(a, b.validator.normalizeRule(a))
        },methods: {required: function(a, c, d) {
                if (!this.depend(d, c))
                    return "dependency-mismatch";
                switch (c.nodeName.toLowerCase()) {
                    case "select":
                        return (a = b(c).val()) && a.length > 0;
                    case "input":
                        if (this.checkable(c))
                            return this.getLength(a, c) > 0;
                    default:
                        return b.trim(a).length > 0
                }
            },remote: function(a, c, d) {
                if (this.optional(c))
                    return "dependency-mismatch";
                var e = this.previousValue(c);
                this.settings.messages[c.name] || (this.settings.messages[c.name] = {});
                e.originalMessage = 
                this.settings.messages[c.name].remote;
                this.settings.messages[c.name].remote = e.message;
                d = typeof d == "string" && {url: d} || d;
                if (e.old !== a) {
                    e.old = a;
                    var f = this;
                    this.startRequest(c);
                    var g = {};
                    g[c.name] = a;
                    b.ajax(b.extend(!0, {type: "POST",url: d,mode: "abort",port: "validate" + c.name,dataType: "json",data: g,success: function(d) {
                            f.settings.messages[c.name].remote = e.originalMessage;
                            var g = d === !0;
                            if (g) {
                                var h = f.formSubmitted;
                                f.prepareElement(c);
                                f.formSubmitted = h;
                                f.successList.push(c);
                                f.showErrors()
                            } else
                                h = {}, d = e.message = 
                                d || f.defaultMessage(c, "remote"), h[c.name] = b.isFunction(d) ? d(a) : d, f.showErrors(h);
                            e.valid = g;
                            f.stopRequest(c, g)
                        }}, d));
                    return "pending"
                } else if (this.pending[c.name])
                    return "pending";
                return e.valid
            },minlength: function(a, c, d) {
                return this.optional(c) || this.getLength(b.trim(a), c) >= d
            },maxlength: function(a, c, d) {
                return this.optional(c) || this.getLength(b.trim(a), c) <= d
            },rangelength: function(a, c, d) {
                a = this.getLength(b.trim(a), c);
                return this.optional(c) || a >= d[0] && a <= d[1]
            },min: function(a, b, d) {
                return this.optional(b) || 
                a >= d
            },max: function(a, b, d) {
                return this.optional(b) || a <= d
            },range: function(a, b, d) {
                return this.optional(b) || a >= d[0] && a <= d[1]
            },email: function(a, b) {
                return this.optional(b) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(a)
            },
            url: function(a, b) {
                if (a != null && a != "") {
                    a = $.trim(a);
                }
                return this.optional(b) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
            },
            date: function(a, b) {
                return this.optional(b) || !/Invalid|NaN/.test(new Date(a))
            },dateISO: function(a, b) {
                return this.optional(b) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)
            },number: function(a, b) {
                return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)
            },digits: function(a, b) {
                return this.optional(b) || /^\d+$/.test(a)
            },creditcard: function(a, b) {
                if (this.optional(b))
                    return "dependency-mismatch";
                if (/[^0-9-]+/.test(a))
                    return !1;
                for (var d = 0, e = 0, f = !1, a = a.replace(/\D/g, ""), g = a.length - 1; g >= 0; g--) {
                    e = 
                    a.charAt(g);
                    e = parseInt(e, 10);
                    if (f && (e *= 2) > 9)
                        e -= 9;
                    d += e;
                    f = !f
                }
                return d % 10 == 0
            },accept: function(a, b, d) {
                d = typeof d == "string" ? RegExp(d) : d;
                return this.optional(b) || d.test(a)
            },equalTo: function(a, c, d) {
                d = b(d).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    b(c).valid()
                });
                return a == d.val()
            }}});
    b.format = b.validator.format
})(jQuery);
(function(b) {
    var a = b.ajax, c = {};
    b.ajax = function(d) {
        var d = b.extend(d, b.extend({}, b.ajaxSettings, d)), e = d.port;
        if (d.mode == "abort")
            return c[e] && c[e].abort(), c[e] = a.apply(this, arguments);
        return a.apply(this, arguments)
    }
})(jQuery);
(function(b) {
    b.each({focus: "focusin",blur: "focusout"}, function(a, c) {
        b.event.special[c] = {setup: function() {
                if (b.browser.msie)
                    return !1;
                this.addEventListener(a, b.event.special[c].handler, !0)
            },teardown: function() {
                if (b.browser.msie)
                    return !1;
                this.removeEventListener(a, b.event.special[c].handler, !0)
            },handler: function(a) {
                arguments[0] = b.event.fix(a);
                arguments[0].type = c;
                return b.event.handle.apply(this, arguments)
            }}
    });
    b.extend(b.fn, {delegate: function(a, c, d) {
            return this.bind(a, function(a) {
                var f = b(a.target);
                if (f.is(c))
                    return d.apply(f, 
                    arguments)
            })
        },triggerEvent: function(a, c) {
            return this.triggerHandler(a, [b.event.fix({type: a,target: c})])
        }})
})(jQuery);
$.metadata.setType("attr", "validate");
$.validator.messages = {required: "\u8bf7\u8f93\u5165\u503c\uff01",remote: "\u8bf7\u68c0\u67e5\u8be5\u503c\u7684\u6b63\u786e\u6027\uff01",email: "\u8bf7\u8f93\u5165\u6b63\u786e\u683c\u5f0f\u7684Email\u5730\u5740\uff01",url: "\u8bf7\u8f93\u5165\u6b63\u786e\u683c\u5f0f\u7684URL\u5730\u5740\uff01",date: "\u8bf7\u8f93\u5165\u6709\u6548\u7684\u65e5\u671f\u683c\u5f0f",dateISO: "\u8bf7\u8f93\u5165\u6b63\u786eISO\u683c\u5f0f\u7684\u65e5\u671f\uff01.",number: "\u8bf7\u8f93\u5165\u6570\u5b57\uff01",digits: "\u8bf7\u8f93\u5165\u6574\u578b\u6570\u5b57\uff01",
    creditcard: "\u8bf7\u8f93\u5165\u6709\u6548\u7684\u4fe1\u7528\u5361\u53f7\u7801\uff01",equalTo: "\u4e24\u6b21\u8f93\u5165\u7684\u503c\u4e0d\u4e00\u81f4\uff01",accept: "\u8f93\u5165\u7684\u4fe1\u606f\u4e0d\u5339\u914d\u5b9a\u4e49\u7684\u89c4\u5219\uff01",maxlength: $.validator.format("\u8f93\u5165\u7684\u5b57\u7b26\u957f\u5ea6\u8d85\u51fa\u4e86 {0} \u4f4d\uff01"),minlength: $.validator.format("\u8bf7\u8f93\u5165\u81f3\u5c11 {0} \u4f4d\u957f\u5ea6\u7684\u5b57\u7b26\uff01"),rangelength: $.validator.format("\u8bf7\u8f93\u5165 {0} - {1} \u4f4d\u957f\u5ea6\u7684\u5b57\u7b26\uff01"),
    range: $.validator.format("\u8bf7\u8f93\u5165 {0} - {1} \u8303\u56f4\u4e4b\u95f4\u7684\u503c\uff01"),max: $.validator.format("\u8bf7\u8f93\u5165\u4e0d\u5927\u4e8e {0} \u7684\u503c\uff01"),min: $.validator.format("\u8bf7\u8f93\u5165\u4e0d\u5c0f\u4e8e {0} \u7684\u503c\uff01")};
jQuery.validator.addMethod("invalidChar", function(b, a, c) {
    c = RegExp("[" + c + "]+");
    return this.optional(a) || !c.test(b)
}, $.format("\u8f93\u5165\u7684\u4fe1\u606f\u4e2d\u542b\u6709\u4ee5\u4e0b\u975e\u6cd5\u5b57\u7b26 {0}"));
jQuery.validator.addMethod("compareTime", function(b, a, c) {
    var d = c[1] || ">", e = c[2] || "yyyy-MM-dd";
    return this.optional(a) || _compareTime_(b, $(c[0]).val(), d, e)
}, $.format("\u65e5\u671f\u6bd4\u8f83\u4e0d\u6ee1\u8db3\u6bd4\u8f83\u8fd0\u7b97\u7b26{1}"));
jQuery.validator.addMethod("date", function(b, a, c) {
    c = (new Date(b)).format(c);
    return this.optional(a) || b === c
}, $.format("\u65e5\u671f\u683c\u5f0f\u4e0d\u6b63\u786e\uff01\u683c\u5f0f\u4e3a\uff1a{0}"));
jQuery.validator.addMethod("regExp", function(b, a, c) {
    c = typeof c == "string" ? RegExp(c) : c;
    return this.optional(a) || c.test(b)
}, "\u8f93\u5165\u7684\u4fe1\u606f\u4e0d\u5339\u914d\u5b9a\u4e49\u7684\u89c4\u5219\uff01");
jQuery.validator.addMethod("CNRangeLength", function(b, a, c) {
    b = b.replace(/[^\x00-\xff]/g, "***").length;
    c[3] = parseInt(c[1] / 3, 10);
    return this.optional(a) || b >= c[0] && b < c[1]
}, $.format("\u8bf7\u8f93\u5165{0}-{1}\u4e2a\u5b57\u7b26\u6216{0}-{3}\u4e2a\u6c49\u5b57\uff01"));
jQuery.validator.addMethod("postalcode", function(b, a) {
    return this.optional(a) || /^[1-9]\d{5}(?!\d)$/.test(b)
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u90ae\u653f\u7f16\u7801\uff01");
jQuery.validator.addMethod("IP", function(b, a) {
    return this.optional(a) || /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test($.trim(b))
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684IP\u5730\u5740\uff01");
jQuery.validator.addMethod("MAC", function(b, a) {
    return this.optional(a) || /^([0-9a-fA-F]){2}(([\s-][0-9a-fA-F]{2}){5})$/.test($.trim(b))
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684MAC\u5730\u5740(\u4ee5 - \u5206\u9694)\uff01");
jQuery.validator.addMethod("telephone", function(b, a) {
    return this.optional(a) || /^(\d{3,4}-)\d{7,8}$/.test($.trim(b))
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u56fa\u5b9a\u7535\u8bdd\u53f7\u7801\uff01\u683c\u5f0f\uff1a\u533a\u53f7-\u53f7\u7801");
jQuery.validator.addMethod("mobile", function(b, a) {
    return this.optional(a) || /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/.test($.trim(b))
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\u7801\uff01");
jQuery.validator.addMethod("dateCN", function(b, a) {
    var c = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
    return this.optional(a) || c.test($.trim(b))
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u683c\u5f0f\u7684\u65e5\u671f(yyyy-MM-dd)\uff01");
jQuery.validator.addMethod("chinese", function(b, a) {
    b = b.replace(/(^\s*)|(\s*$)/g, "");
    return this.optional(a) || /^[\u4e00-\u9fa5]+$/gi.test($.trim(b))
}, "\u8bf7\u8f93\u5165\u4e2d\u6587\u5b57\u7b26\uff01");
jQuery.validator.addMethod("validChar", function(b, a) {
    return this.optional(a) || !/[`~\^\'\"]+/g.test($.trim(b))
}, "\u8f93\u5165\u4fe1\u606f\u4e2d\u542b\u6709\u975e\u6cd5\u5b57\u7b26 ` ' \" ~ ^ ");
jQuery.validator.addMethod("IDCard", function(b, a) {
    return this.optional(a) || _checkIDCard_($.trim(b))
}, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u8eab\u4efd\u8bc1\u53f7\u7801\uff01");
function _checkIDCard_(b) {
    var a = !1, c = {11: "\u5317\u4eac",12: "\u5929\u6d25",13: "\u6cb3\u5317",14: "\u5c71\u897f",15: "\u5185\u8499\u53e4",21: "\u8fbd\u5b81",22: "\u5409\u6797",23: "\u9ed1\u9f99\u6c5f",31: "\u4e0a\u6d77",32: "\u6c5f\u82cf",33: "\u6d59\u6c5f",34: "\u5b89\u5fbd",35: "\u798f\u5efa",36: "\u6c5f\u897f",37: "\u5c71\u4e1c",41: "\u6cb3\u5357",42: "\u6e56\u5317",43: "\u6e56\u5357",44: "\u5e7f\u4e1c",45: "\u5e7f\u897f",46: "\u6d77\u5357",50: "\u91cd\u5e86",51: "\u56db\u5ddd",52: "\u8d35\u5dde",53: "\u4e91\u5357",54: "\u897f\u85cf",
        61: "\u9655\u897f",62: "\u7518\u8083",63: "\u9752\u6d77",64: "\u5b81\u590f",65: "\u65b0\u7586",71: "\u53f0\u6e7e",81: "\u9999\u6e2f",82: "\u6fb3\u95e8",91: "\u56fd\u5916"}, d = function(a) {
        return /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.test(a) ? !0 : !1
    };
    if (/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(b))
        if (c[b.substr(0, 
        2)] == null || c[b.substring(0, 2)] == "")
            return a = !1;
        else
            switch (b.length) {
                case 15:
                    if (d(parseInt(b.substr(6, 2), 10) + 1900 + "-" + b.substr(8, 2) + "-" + b.substr(10, 2)))
                        a = !0;
                    else
                        return a = !1;
                    break;
                case 18:
                    if (!d(b.substr(6, 4) + "-" + b.substr(10, 2) + "-" + b.substr(12, 2)))
                        return a = !1;
                    b = b.split("");
                    if ("10X98765432".substr(((parseInt(b[0], 10) + parseInt(b[10], 10)) * 7 + (parseInt(b[1], 10) + parseInt(b[11], 10)) * 9 + (parseInt(b[2], 10) + parseInt(b[12], 10)) * 10 + (parseInt(b[3], 10) + parseInt(b[13], 10)) * 5 + (parseInt(b[4], 10) + parseInt(b[14], 10)) * 
                    8 + (parseInt(b[5], 10) + parseInt(b[15], 10)) * 4 + (parseInt(b[6], 10) + parseInt(b[16], 10)) * 2 + parseInt(b[7], 10) * 1 + parseInt(b[8], 10) * 6 + parseInt(b[9], 10) * 3) % 11, 1) != b[17])
                        return a = !1;
                    a = !0
            }
    else
        return a = !1;
    return a
}
function _compareTime_(b, a, c, d) {
    function e(a) {
        var b = 0;
        r = a.match(/\d+/g).sort(function() {
            return g[b++]
        });
        return new Date(r[0] + "/" + r[1] + "/" + r[2] + " " + (r[3] || "00") + ":" + (r[4] || "00") + ":" + (r[5] || "00"))
    }
    var b = b || "0000-00-00", a = a || "0000-00-00", c = c || ">", f = {yyyy: 1,MM: 2,dd: 3,HH: 4,mm: 5,ss: 6}, g = [], f = (d || "yyyy-MM-dd").replace(/(\w+)/g, function(a, b) {
        return f[b]
    }).match(/\w+/g).sort(function(a, b) {
        g.push(a - b);
        return a - b
    });
    switch ($.trim(c)) {
        case ">":
            return e(b) > e(a);
        case ">=":
            return e(b) >= e(a);
        case "<":
            return e(b) < 
            e(a);
        case "<=":
            return e(b) <= e(a);
        case "==":
        case "===":
            return e(b) === e(a);
        case "!=":
        case "!==":
            return e(b) !== e(a);
        default:
            return e(b) > e(a)
    }
}
(function() {
    Date.prototype.format = function(b) {
        var b = b || "yyyy-MM-dd HH:mm:ss", a = {"M+": this.getMonth() + 1,"d+": this.getDate(),"H+": this.getHours(),"m+": this.getMinutes(),"s+": this.getSeconds(),"q+": Math.floor((this.getMonth() + 3) / 3),S: this.getMilliseconds()};
        /(y+)/.test(b) && (b = b.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var c in a)
            RegExp("(" + c + ")").test(b) && (b = b.replace(RegExp.$1, RegExp.$1.length == 1 ? a[c] : ("00" + a[c]).substr(("" + a[c]).length)));
        return b
    }
})();
