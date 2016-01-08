'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fitPagination = require('fit-pagination');

var _fitPagination2 = _interopRequireDefault(_fitPagination);

var _fitCheckbox = require('fit-checkbox');

var _fitCheckbox2 = _interopRequireDefault(_fitCheckbox);

var _fitRadio = require('fit-radio');

var _fitRadio2 = _interopRequireDefault(_fitRadio);

var _fitInput = require('fit-input');

var _fitInput2 = _interopRequireDefault(_fitInput);

var _fitButton = require('fit-button');

var _fitButton2 = _interopRequireDefault(_fitButton);

var _finder = require('./finder');

var _finder2 = _interopRequireDefault(_finder);

var _add = require('./add');

var _add2 = _interopRequireDefault(_add);

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 判断当前行是否在选择的行信息里
var inRowList = function inRowList(info, index, list) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var val = _step.value;

            if (index === val.index && _lodash2.default.isEqual(info, val.info)) {
                return true;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return false;
};

var Table = (function (_React$Component) {
    _inherits(Table, _React$Component);

    function Table(props) {
        _classCallCheck(this, Table);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Table).call(this, props));

        _this.state = {
            datas: [],
            paginOpts: {},
            currentPage: 1,
            loading: false,
            fields: _lodash2.default.cloneDeep(_this.props.fields),
            info: {
                message: '',
                type: ''
            },

            // 当前排序的key
            sortKey: '',

            // 当前排序状态 （不排序,正序,倒序）
            sortStatu: null,

            // 行选择模式下选择的行信息
            selectRowList: [],

            // 当前显示input框的位置
            showInputPosition: {
                x: -1,
                y: -1
            },

            // 编辑框内容
            editValue: null
        };

        // dom任意位置点击
        _this.handleDocumentClick = function (event) {
            if ((0, _jquery2.default)(_this.dom).find('#edit-input').length === 0) return;
            if (!_jquery2.default.contains((0, _jquery2.default)(_this.dom).find('#edit-input')[0], event.target)) {
                _this.setState({
                    showInputPosition: {
                        x: -1,
                        y: -1
                    },
                    editValue: null
                });
            }
        };
        return _this;
    }

    _createClass(Table, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props !== nextProps) {
                var newProps = _lodash2.default.cloneDeep(nextProps);
                // 是否添加表头
                if (this.props.selector.type === 'checkbox' && this.props.fields[0].type !== 'checkbox') {
                    newProps.fields.unshift({
                        type: 'checkbox'
                    });
                }
                if (this.props.selector.type === 'radio' && this.props.fields[0].type !== 'radio') {
                    newProps.fields.unshift({
                        type: 'radio'
                    });
                }

                this.setState({
                    fields: _lodash2.default.cloneDeep(newProps.fields)
                });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            // 查询请求参数
            this.searchOpts = {};

            // 上一个请求返回的内容
            this.prevResponse = null;

            // extend获取内容
            this.extendInfo = {
                getCurrentSelectRows: function getCurrentSelectRows() {
                    var selectList = [];
                    _this2.state.selectRowList.map(function (item) {
                        selectList.push(item.info);
                    });
                    return _lodash2.default.cloneDeep(selectList);
                },
                currentPage: function currentPage() {
                    return _this2.state.currentPage;
                },
                jump: function jump(page) {
                    _this2.updateTable(page);
                },
                info: function info(message, type) {
                    _this2.info(message, type);
                }
            };

            // 是否添加表头
            if (this.props.selector.type === 'checkbox') {
                this.state.fields.unshift({
                    type: 'checkbox'
                });
            }
            if (this.props.selector.type === 'radio') {
                this.state.fields.unshift({
                    type: 'radio'
                });
            }

            this.updateTable();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.dom = _reactDom2.default.findDOMNode(this);
            (0, _jquery2.default)(document).on('click', this.handleDocumentClick);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            (0, _jquery2.default)(document).off('click', this.handleDocumentClick);
            if (this.infoSetTimeout) {
                clearTimeout(this.infoSetTimeout);
            }
        }

        // 提示信息

    }, {
        key: 'info',
        value: function info(message, type) {
            var _this3 = this;

            this.setState({
                info: {
                    message: message,
                    type: type
                }
            }, function () {
                if (_this3.infoSetTimeout) {
                    clearTimeout(_this3.infoSetTimeout);
                }
                _this3.infoSetTimeout = setTimeout(function () {
                    _this3.setState({
                        info: {
                            message: '',
                            type: ''
                        }
                    });
                }, 2000);
            });
        }

        // 刷新数据表

    }, {
        key: 'updateTable',
        value: function updateTable(page, params) {
            var _this4 = this;

            if (this.props.get.url === '') {
                this.setState({
                    datas: this.props.datas
                });
            } else {
                _jquery2.default.ajax({
                    url: this.props.get.url,
                    method: this.props.get.method,
                    dataType: this.props.get.dataType || 'json',
                    beforeSend: function beforeSend() {
                        _this4.setState({
                            loading: true
                        });
                    },
                    data: this.props.get.beforeSend(params || this.searchOpts, page || this.state.currentPage, this.prevResponse)
                }).done(function (res) {
                    if (typeof res === 'string') {
                        res = JSON.parse(res);
                    }

                    // 保存当前返回值
                    _this4.prevResponse = res;

                    var newPaginOpts = _this4.state.paginOpts;
                    var newDatas = _this4.props.get.success(res, newPaginOpts);

                    _this4.setState({
                        datas: newDatas,
                        paginOpts: newPaginOpts,
                        currentPage: page || _this4.state.currentPage,
                        loading: false,
                        selectRowList: []
                    });
                });
            }
        }

        // 翻页

    }, {
        key: 'handleChangePage',
        value: function handleChangePage(page) {
            this.updateTable(page);
        }

        // radio行选择点击

    }, {
        key: 'onTrRadioClick',
        value: function onTrRadioClick(info, index) {
            this.setState({
                selectRowList: [{
                    info: info,
                    index: index
                }]
            });
        }

        // checkbox行选择点击

    }, {
        key: 'onTrCheckboxClick',
        value: function onTrCheckboxClick(info, index, checked) {
            var newSelectRowList = _lodash2.default.cloneDeep(this.state.selectRowList);

            if (checked) {
                newSelectRowList.push({
                    info: info,
                    index: index
                });
            } else {
                _lodash2.default.remove(newSelectRowList, function (item) {
                    if (item.index === index && _lodash2.default.isEqual(item.info, info)) {
                        return true;
                    }
                    return false;
                });
            }

            this.setState({
                selectRowList: newSelectRowList
            });
        }

        // checkbox行全选

    }, {
        key: 'onTrCheckboxSelectAll',
        value: function onTrCheckboxSelectAll(checked) {
            var _this5 = this;

            if (checked) {
                (function () {
                    var newSelectRowList = [];
                    _this5.state.datas.map(function (item, index) {
                        newSelectRowList.push({
                            info: item,
                            index: index
                        });
                    });
                    _this5.setState({
                        selectRowList: newSelectRowList
                    });
                })();
            } else {
                this.setState({
                    selectRowList: []
                });
            }
        }

        // 查询按钮点击

    }, {
        key: 'handleSearch',
        value: function handleSearch(params) {
            this.updateTable(1, _jquery2.default.extend(_lodash2.default.cloneDeep(this.searchOpts), params));
        }

        // 点击删除按钮

    }, {
        key: 'handleDelete',
        value: function handleDelete(colInfo) {
            var _this6 = this;

            _jquery2.default.ajax({
                url: this.props.del.url,
                method: this.props.del.method,
                dataType: this.props.get.dataType || 'json',
                beforeSend: function beforeSend() {
                    _this6.setState({
                        loading: true
                    });
                },
                data: this.props.del.beforeSend(colInfo)
            }).done(function (res) {
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                }

                var info = _this6.props.del.success(res);

                _this6.setState({
                    loading: false
                });

                // 如果删除失败,提示错误
                if (!info.ok) {
                    _this6.info(info.message, 'danger');
                    return;
                }

                // 删除成功,如果当前页剩余条目只有一个,且不是第一页,刷新到上一页,否则刷新当前页面
                if (_this6.state.datas.length <= 1 && _this6.state.currentPage > 1) {
                    _this6.updateTable(_this6.state.currentPage - 1);
                } else {
                    _this6.updateTable();
                }
            });
        }

        // 添加

    }, {
        key: 'handleAdd',
        value: function handleAdd(params, callback) {
            var _this7 = this;

            _jquery2.default.ajax({
                url: this.props.add.url,
                method: this.props.add.method,
                data: this.props.add.beforeSend(params),
                dataType: this.props.get.dataType || 'json'
            }).done(function (res) {
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                }

                var info = _this7.props.add.success(res);
                callback(info);

                if (info.ok) {
                    _this7.updateTable();
                }
            });
        }
    }, {
        key: 'handleSortChange',
        value: function handleSortChange(key, isSort) {
            var _this8 = this;

            if (!isSort) return;

            var sortStatu = null;

            if (key === this.state.sortKey) {
                switch (this.state.sortStatu) {
                    case null:
                        sortStatu = 'asc';
                        break;
                    case 'asc':
                        sortStatu = 'desc';
                        break;
                    case 'desc':
                        sortStatu = null;
                        break;
                }
            } else {
                sortStatu = 'asc';
            }

            this.setState({
                sortKey: key,
                sortStatu: sortStatu
            }, function () {
                var searchParam = _this8.props.onSort(key, _this8.state.sortStatu);
                _this8.searchOpts = _jquery2.default.extend(_this8.searchOpts, searchParam);
                _this8.updateTable(1);
            });
        }

        // 双击某一个条目

    }, {
        key: 'handleTdDoubleClick',
        value: function handleTdDoubleClick(index, elIndex) {
            var _this9 = this;

            this.setState({
                showInputPosition: {
                    x: index,
                    y: elIndex
                }
            }, function () {
                (0, _jquery2.default)(_this9.dom).find('#edit-input input').focus();
            });
        }

        // 修改编辑框内容

    }, {
        key: 'handleChangeEditValue',
        value: function handleChangeEditValue(value) {
            this.setState({
                editValue: value
            });
        }

        // 编辑点击保存按钮

    }, {
        key: 'handleEditSave',
        value: function handleEditSave(key) {
            var _this10 = this;

            _jquery2.default.ajax({
                url: this.props.edit.url,
                method: this.props.edit.method,
                data: this.props.edit.beforeSend(this.state.editValue, key),
                dataType: this.props.get.dataType || 'json'
            }).done(function (res) {
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                }

                var info = _this10.props.edit.success(res);

                if (info.ok) {
                    _this10.setState({
                        showInputPosition: {
                            x: -1,
                            y: -1
                        },
                        editValue: null
                    }, function () {
                        // 刷新当前页
                        _this10.updateTable();
                    });
                } else {
                    _this10.info(info.message, 'danger');
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this11 = this;

            var Th = this.state.fields.map(function (item, index) {
                switch (item.type) {
                    case 'checkbox':
                        return _react2.default.createElement(
                            'th',
                            { key: index,
                                style: { width: 100 } },
                            _react2.default.createElement(
                                _fitCheckbox2.default,
                                { onChange: _this11.onTrCheckboxSelectAll.bind(_this11),
                                    checked: _this11.state.datas.length === _this11.state.selectRowList.length },
                                '全选'
                            )
                        );
                    case 'radio':
                        return _react2.default.createElement('th', { key: index,
                            style: { width: 100 } });
                    default:
                        var arrowClass = (0, _classnames2.default)({
                            'sort-can-use': item.sort && (_this11.state.sortKey !== item.key || _this11.state.sortStatu === null),
                            'fa': item.sort,
                            'fa-sort': item.sort && (_this11.state.sortKey !== item.key || _this11.state.sortStatu === null),
                            'fa-sort-asc': item.sort && _this11.state.sortKey === item.key && _this11.state.sortStatu === 'asc',
                            'fa-sort-desc': item.sort && _this11.state.sortKey === item.key && _this11.state.sortStatu === 'desc'
                        });

                        var Arrow = _react2.default.createElement('i', { className: arrowClass });

                        var thClass = (0, _classnames2.default)({
                            'table-th': true,
                            'sortable': item.sort
                        });

                        return _react2.default.createElement(
                            'th',
                            { key: index,
                                className: thClass,
                                onClick: _this11.handleSortChange.bind(_this11, item.key, item.sort) },
                            item.value,
                            item.sort ? Arrow : null
                        );
                }
            });

            // 如果有删除功能,右侧新增一列
            if (this.props.del.url !== '') {
                Th.push(_react2.default.createElement('th', { key: 'delete' }));
            }

            var TrTd = this.state.datas.map(function (tr, index) {
                var Td = _this11.state.fields.map(function (field, fieldIndex) {
                    if (typeof field.render === 'function') {
                        return _react2.default.createElement(
                            'td',
                            { key: fieldIndex },
                            field.render(tr, _this11.extendInfo)
                        );
                    }

                    switch (field.type) {
                        case 'checkbox':
                            return _react2.default.createElement(
                                'td',
                                { key: fieldIndex },
                                _react2.default.createElement(_fitCheckbox2.default, { onChange: _this11.onTrCheckboxClick.bind(_this11, tr, index),
                                    checked: inRowList(tr, index, _this11.state.selectRowList) })
                            );
                        case 'radio':
                            return _react2.default.createElement(
                                'td',
                                { key: fieldIndex },
                                _react2.default.createElement(_fitRadio2.default, { onChange: _this11.onTrRadioClick.bind(_this11, tr, index),
                                    checked: inRowList(tr, index, _this11.state.selectRowList) })
                            );
                        default:
                            if (field.edit) {
                                if (index === _this11.state.showInputPosition.x && fieldIndex === _this11.state.showInputPosition.y) {
                                    return _react2.default.createElement(
                                        'td',
                                        { key: fieldIndex,
                                            style: { padding: 0, border: 'none' },
                                            id: 'edit-input' },
                                        _react2.default.createElement(
                                            'div',
                                            { style: { display: 'flex' } },
                                            _react2.default.createElement(_fitInput2.default, { value: _this11.state.editValue || tr[field.key],
                                                onChange: _this11.handleChangeEditValue.bind(_this11) }),
                                            _react2.default.createElement(
                                                _fitButton2.default,
                                                { type: 'success',
                                                    style: { borderRadius: 0, marginLeft: -1 },
                                                    onClick: _this11.handleEditSave.bind(_this11) },
                                                _react2.default.createElement('i', { className: 'fa fa-check' })
                                            )
                                        )
                                    );
                                }

                                return _react2.default.createElement(
                                    'td',
                                    { key: fieldIndex,
                                        onDoubleClick: _this11.handleTdDoubleClick.bind(_this11, index, fieldIndex) },
                                    tr[field.key]
                                );
                            }
                            return _react2.default.createElement(
                                'td',
                                { key: fieldIndex },
                                tr[field.key]
                            );
                    }
                });

                // 如果有删除功能,右侧新增一列
                if (_this11.props.del.url !== '') {
                    Td.push(_react2.default.createElement(
                        'td',
                        { style: { padding: 0 },
                            className: 'remove',
                            key: 'delete',
                            onClick: _this11.handleDelete.bind(_this11, tr) },
                        _react2.default.createElement('i', { className: 'fa fa-trash' })
                    ));
                }

                return _react2.default.createElement(
                    'tr',
                    { key: index },
                    Td
                );
            });

            var infoClass = (0, _classnames2.default)(_defineProperty({
                'pull-right': true
            }, this.state.info.type, this.state.info.type !== ''));

            var Table = _react2.default.createElement(
                'table',
                { className: 'table table-striped' },
                _react2.default.createElement(
                    'thead',
                    null,
                    _react2.default.createElement(
                        'tr',
                        null,
                        Th
                    )
                ),
                _react2.default.createElement(
                    'tbody',
                    null,
                    _lodash2.default.isEmpty(this.state.datas) ? _react2.default.createElement(
                        'tr',
                        null,
                        _react2.default.createElement(
                            'td',
                            { colSpan: this.state.fields.length },
                            _react2.default.createElement(
                                'span',
                                { className: 'empty-content' },
                                '暂时没有数据~'
                            )
                        )
                    ) : TrTd
                )
            );

            if (this.props.responsive) {
                Table = _react2.default.createElement(
                    'div',
                    { className: 'table-responsive' },
                    Table
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'lib-pc-table-lib-table' },
                _react2.default.createElement(
                    'div',
                    { className: 'panel' },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-heading' },
                        this.props.title,
                        this.props.add.url === '' ? null : _react2.default.createElement(_add2.default, { fields: this.props.fields,
                            opts: this.props.add,
                            onAdd: this.handleAdd.bind(this) }),
                        _react2.default.createElement(
                            'span',
                            { className: infoClass,
                                style: { marginLeft: 10 } },
                            this.state.info.message
                        )
                    ),
                    _lodash2.default.isEmpty(this.props.finder) ? null : _react2.default.createElement(_finder2.default, { onSearch: this.handleSearch.bind(this),
                        finder: this.props.finder }),
                    Table,
                    _lodash2.default.isEmpty(this.state.paginOpts) && _lodash2.default.isEmpty(this.props.extend()) ? null : _react2.default.createElement(
                        'div',
                        { className: 'pagination-container' },
                        _react2.default.createElement(
                            'div',
                            {
                                style: { flexGrow: 1, paddingLeft: 15 } },
                            this.props.extend(this.extendInfo)
                        ),
                        _lodash2.default.isEmpty(this.state.paginOpts) ? null : _react2.default.createElement(_fitPagination2.default, _extends({ style: { flexGrow: 1 },
                            onChange: this.handleChangePage.bind(this)
                        }, this.state.paginOpts, {
                            loading: this.state.loading }))
                    )
                )
            );
        }
    }]);

    return Table;
})(_react2.default.Component);

exports.default = Table;

Table.defaultProps = {
    title: '表格',

    // 表头字段
    fields: [],

    // 打底数据
    datas: [],

    add: {
        url: '',
        method: 'get',
        dataType: 'json',
        beforeSend: function beforeSend(info) {
            return info;
        },
        success: function success(res) {
            return res.errno === 0;
        }
    },

    del: {
        url: '',
        method: 'get',
        dataType: 'json',
        beforeSend: function beforeSend(info) {
            return info;
        },
        success: function success(res) {
            return res.errno === 0;
        }
    },

    update: {
        url: '',
        method: 'get',
        dataType: 'json',
        beforeSend: function beforeSend(info) {
            return info;
        },
        success: function success(res) {
            return res.errno === 0;
        }
    },

    get: {
        url: '',
        method: 'get',
        dataType: 'json',
        beforeSend: function beforeSend(info) {
            return info;
        },
        success: function success(res) {
            return res.data;
        }
    },

    search: [],

    // 行选择
    selector: {},

    // 条件查询
    finder: {},

    // 拓展
    extend: function extend(table) {},

    // 排序回调
    onSort: function onSort(key) {},

    // 编辑回调
    onEdit: function onEdit() {},

    responsive: false
};