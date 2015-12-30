'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fitInput = require('fit-input');

var _fitInput2 = _interopRequireDefault(_fitInput);

var _fitButton = require('fit-button');

var _fitButton2 = _interopRequireDefault(_fitButton);

var _fitSelect = require('fit-select');

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Finder = (function (_React$Component) {
    _inherits(Finder, _React$Component);

    function Finder(props) {
        _classCallCheck(this, Finder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Finder).call(this, props));

        _this.state = {
            opts: _this.props.finder
        };

        _this.getChilds = function (lists, notEnum, parentIndex) {
            return lists.map(function (item, index) {
                var itemStyle = {
                    marginLeft: index === 0 ? null : 10,
                    width: item.width || null,
                    display: 'flex'
                };

                switch (item.type) {
                    case 'text':
                        return _react2.default.createElement(_fitInput2.default, { key: index, style: itemStyle, label: notEnum ? null : item.label,
                            value: item.value || item.defaultValue,
                            onChange: _this.handleChange.bind(_this, index, parentIndex) });
                    case 'select':
                        var Options = item.select.map(function (elItem, elIndex) {
                            return _react2.default.createElement(
                                _fitSelect.Option,
                                { key: elIndex, value: elItem.key },
                                elItem.value
                            );
                        });
                        return _react2.default.createElement(
                            _fitSelect.Select,
                            { width: '100%', style: itemStyle, key: index, label: notEnum ? null : item.label,
                                value: item.value || item.defaultValue || item.select[0].key,
                                onChange: _this.handleChange.bind(_this, index, parentIndex) },
                            Options
                        );
                    case 'enum':
                        if (notEnum) break;
                        // 循环出option列表
                        var EnumOptions = item.enum.map(function (elItem, elIndex) {
                            return _react2.default.createElement(
                                _fitSelect.Option,
                                { key: elIndex, value: elItem.key },
                                elItem.label
                            );
                        });

                        // 显示当前的child
                        var Children = null;
                        var Childrens = _this.getChilds(item.enum, true, index);
                        item.enum.map(function (elItem, elIndex) {
                            if (elItem.key === (item.value || item.defaultValue)) {
                                Children = Childrens[elIndex];
                            }
                        });

                        return _react2.default.createElement(
                            'div',
                            { key: index, style: itemStyle },
                            _react2.default.createElement(
                                _fitSelect.Select,
                                { onChange: _this.handleEnumChange.bind(_this, index),
                                    width: '120', simple: true,
                                    key: index, value: item.value || item.defaultValue },
                                EnumOptions
                            ),
                            Children
                        );
                }
            });
        };
        return _this;
    }

    // 选项被修改

    _createClass(Finder, [{
        key: 'handleChange',
        value: function handleChange(index, parentIndex, value) {
            var newOpts = this.state.opts;

            if (!parentIndex) {
                newOpts[index].value = value;
            } else {
                newOpts[parentIndex].enum[index].value = value;
            }

            this.setState({
                opts: newOpts
            });
        }

        // enum被修改

    }, {
        key: 'handleEnumChange',
        value: function handleEnumChange(index, value) {
            var newOpts = this.state.opts;
            newOpts[index].value = value;
            this.setState({
                opts: newOpts
            });
        }
    }, {
        key: 'handleSearch',
        value: function handleSearch() {
            // 查出当前提交参数
            var params = {};
            this.state.opts.map(function (item) {
                if (item.type === 'enum') {
                    item.enum.map(function (elItem) {
                        if (elItem.key === (item.value || item.defaultValue) && (elItem.value || elItem.defaultValue)) {
                            params[elItem.key] = elItem.value || elItem.defaultValue;
                        }
                    });
                    return;
                }

                if (item.value || item.defaultValue) {
                    params[item.key] = item.value || item.defaultValue;
                }
            });
            this.props.onSearch(params);
        }
    }, {
        key: 'render',
        value: function render() {
            var Finders = this.getChilds(this.state.opts);

            return _react2.default.createElement(
                'div',
                { className: 'lib-pc-table-lib-table-finder' },
                Finders,
                _react2.default.createElement(
                    'div',
                    { style: { flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItem: 'center' } },
                    _react2.default.createElement(
                        _fitButton2.default,
                        { addonLeft: 'search',
                            onClick: this.handleSearch.bind(this),
                            type: 'primary' },
                        '查询'
                    )
                )
            );
        }
    }]);

    return Finder;
})(_react2.default.Component);

exports.default = Finder;

Finder.defaultProps = {
    finder: []
};