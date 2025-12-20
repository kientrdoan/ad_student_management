"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Dropdown,
  Checkbox,
  Tag,
  Select,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartmentAction,
  editDepartmentAction,
  getAllAction,
  addDepartmentAction,
} from "../redux/actions/DepartmentsAction";
import dayjs from "dayjs";
import { BiRecycle } from "react-icons/bi";

export default function Department() {
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const departments = useSelector(
    (state) => state.DepartmentReducer.departments
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    // id: true,
    stt: true,
    code: true,
    name: true,
    is_deleted: true,
    created_at: true,
    updated_at: true,
  });

  useEffect(() => {
    dispatch(getAllAction(statusFilter));
  }, [dispatch, statusFilter]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        // Sửa thông tin khoa
        const newValues = { ...editingRecord, ...values };
        const res = await dispatch(
          editDepartmentAction(editingRecord.id, newValues)
        );
        if (res.success) {
          messageApi.success("Thay đổi thông tin khoa thành công!");
          dispatch(getAllAction(statusFilter));
        } else {
          messageApi.error("Thay đổi thông tin khoa thất bại!");
        }
      } else {
        // Thêm mới khoa → tự động set is_active = true
        const newDept = { ...values, is_deleted: true };
        const res = await dispatch(addDepartmentAction(newDept));
        if (res.success) {
          messageApi.success("Thêm khoa thành công!");
          dispatch(getAllAction(statusFilter));
        } else {
          messageApi.error(
            res.error?.response?.data?.message || "Thêm khoa thất bại!"
          );
        }
      }

      setIsModalVisible(false);
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteDepartmentAction(id));
    if (res.success) {
      messageApi.success("Thành công!");
      dispatch(getAllAction(statusFilter));
    } else {
      messageApi.error("Thất bại!");
    }
  };

  // Lọc dữ liệu theo tìm kiếm + trạng thái
  const filteredData = departments.filter((dept) => {
    const searchLower = searchText.toLowerCase();
    const matchesSearch =
      dept.code?.toLowerCase().includes(searchLower) ||
      dept.name?.toLowerCase().includes(searchLower);

    // const matchesStatus =
    //   statusFilter === "all"
    //     ? true
    //     : statusFilter === "active"
    //     ? dept.is_active === true || dept.is_active === 1
    //     : dept.is_active === false || dept.is_active === 0;

    // return matchesSearch && matchesStatus;
    return matchesSearch;
  });

  const handleStatus = (value) => {
    setStatusFilter(value);
    // if (value === "all") {
    //   dispatch(getAllAction({}));
    // } else if (value === "active") {
    //   dispatch(getAllAction(statusFilter));
    // } else {
    //   dispatch(getAllAction(statusFilter));
    // }
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // const columnMenu = {
  //   items: Object.keys(visibleColumns).map((key) => ({
  //     key,
  //     label: (
  //       <Checkbox
  //         checked={visibleColumns[key]}
  //         onChange={() => toggleColumn(key)}
  //       >
  //         {key}
  //       </Checkbox>
  //     ),
  //   })),
  // };

  const columnMenu = {
    items: [
      // {
      //   key: "id",
      //   label: (
      //     <Checkbox
      //       checked={visibleColumns.id}
      //       onChange={() => toggleColumn("id")}
      //     >
      //       ID
      //     </Checkbox>
      //   ),
      // },
      {
        key: "stt",
        label: (
          <Checkbox
            checked={visibleColumns.stt}
            onChange={() => toggleColumn("stt")}
          >
            stt
          </Checkbox>
        ),
      },
      {
        key: "code",
        label: (
          <Checkbox
            checked={visibleColumns.code}
            onChange={() => toggleColumn("code")}
          >
            Mã khoa
          </Checkbox>
        ),
      },
      {
        key: "name",
        label: (
          <Checkbox
            checked={visibleColumns.name}
            onChange={() => toggleColumn("name")}
          >
            Tên khoa
          </Checkbox>
        ),
      },
        {
        key: "is_deleted",
        label: (
          <Checkbox
            checked={visibleColumns.is_deleted}
            onChange={() => toggleColumn("is_deleted")}
          >
            Trạng thái
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox
            checked={visibleColumns.created_at}
            onChange={() => toggleColumn("created_at")}
          >
            Ngày tạo
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox
            checked={visibleColumns.updated_at}
            onChange={() => toggleColumn("updated_at")}
          >
            Cập nhật gần nhất
          </Checkbox>
        ),
      },
    ],
  };

  const allColumns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   visible: visibleColumns.id,
    //   width: 80,
    // },
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      visible: visibleColumns.stt,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã khoa",
      dataIndex: "code",
      key: "code",
      visible: visibleColumns.code,
      render: (code) => <Tag color='green'>{code}</Tag>,
    },
    {
      title: "Tên Khoa",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      visible: visibleColumns.is_deleted,
      render: (is_deleted) =>
        is_deleted === undefined ? (
          <Tag color='default'>N/A</Tag>
        ) : is_deleted === false ? (
          <Tag color='green'>Hoạt động</Tag>
        ) : (
          <Tag color='red'>Không hoạt động</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) =>
        record.is_deleted === true ? (
          <Button
            type='link'
            icon={<BiRecycle />}
            onClick={() => handleDelete(record.id)}
            className='text-indigo-600'
          />
        ) : (
          <Space>
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              className='text-indigo-600'
            />
            <Popconfirm
              title='Bạn có chắc muốn xoá thông tin khoa này?'
              okText='OK'
              cancelText='Hủy'
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      visible: true,
      fixed: "right",
      width: 150,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className='h-full flex flex-col'>
      {contextHolder}
      <div className='bg-white rounded-xl shadow-sm p-6 flex flex-col h-full'>
        <div className='mb-6 flex-shrink-0'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
              <ApartmentOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Khoa</h1>
              <p className='text-sm text-gray-500'>
                Manage department information and structure
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-6 gap-4 flex-shrink-0'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={showAddModal}
            size='large'
            className='shadow-sm'
          >
            Thêm mới
          </Button>

          <Space size='middle'>
            <Input
              placeholder='Tìm kiếm...'
              prefix={<SearchOutlined className='text-gray-400' />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              size='large'
              allowClear
              className='rounded-lg'
            />

            <Select
              value={statusFilter}
              onChange={handleStatus}
              style={{ width: 180 }}
              size='large'
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
            />

            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button
                icon={<SettingOutlined />}
                size='large'
                className='rounded-lg'
              >
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className='flex-1 overflow-hidden'>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey='id'
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} departments`,
            }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Department" : "Add Department"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Mã khoa'
            name='code'
            rules={[{ required: true, message: "Please input code!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Tên khoa'
            name='name'
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
