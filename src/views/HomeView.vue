<template>
  <Transition name="fade" mode="out-in">
    <div v-if="requests" style="padding: 0 20px; display: flex; flex-direction: column;">
      <v-btn @click="showCreateModal" class="create-button">Создать</v-btn>
      <div class="search-container">
        <v-input :type="'text'" v-model="searchQuery" placeholder="Поиск (№ заявки, название)"
          :iconNameEnd="'mdi:magnify'" />

        <div class="choose-field">
          <select @select="applyFilterHomes()" v-model="selectedHome">
            <option value="">Выберите дом</option>
            <option v-for="home in homes?.results" :key="home?.id" :value="home?.id">{{ home?.address }}</option>
          </select>
          <span class="arrow-down"></span>
        </div>
      </div>

      <div class="table-container">
        <table class="requests-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Создана</th>
              <th>Адрес</th>
              <th>Заявитель</th>
              <th>Описание</th>
              <th>Срок</th>
              <th>Статус</th>
            </tr>
          </thead>
          <Transition name="fade">
            <tbody v-if="isLoaded">
              <tr v-for="req in requests?.results" :key="req.id">
                <td><v-btn class="request-number-button" @click="editRequest(req)">{{ req.number }}</v-btn></td>
                <td>{{ formatDate(req.created_at) }}</td>
                <td>{{ req.premise?.address }}</td>
                <td>{{ formatRequesterName(req.applicant) }}</td>
                <td>{{ req.description }}</td>
                <td>{{ formatDate(req.due_date) }}</td>
                <td>{{ req.status.name }}</td>
              </tr>
            </tbody>
          </Transition>
        </table>
      </div>

      <div class="pagination">
        <v-btn :disabled="requests.page === 1" @click="prevPage">Предыдущая</v-btn>
        <div v-if="requests.pages > 1" class="page-buttons-container">
          <button v-if="requests.page > 4" @click="paginateTo(1)"
            :class="`page-btn ${requests.page === 1 ? 'active' : ''}`" :key="1"
            style="border: 50%; margin-left: 5px;">1</button>
          <span v-if="requests.page > 4" class="three-dot">...</span>
          <button @click="paginateTo(btn)" :class="`page-btn ${requests.page == btn ? 'active' : ''}`"
            v-for="btn in clickablePages" :key="btn" style="border: 50%;">{{ btn }}</button>
          <span v-if="requests.page + 7 < requests.pages" class="three-dot">...</span>
          <button v-if="requests.page !== requests.pages" @click="paginateTo(lastPageButton)"
            :class="`page-btn ${requests.page === requests.pages ? 'active' : ''}`" :key="lastPageButton"
            style="border: 50%; margin-left: 5px;">{{ lastPageButton }}</button>
        </div>
        <v-btn :disabled="requests.page === requests.pages" @click="nextPage">Следующая</v-btn>
      </div>
      <RequestEditingModal v-if="isShow" />
    </div>
    <loader v-else></loader>
  </Transition>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RequestEditingModal from "@/components/modals/RequestEditingModal.vue";

export default {
  name: "HomeView",
  data() {
    return {
      searchQuery: "",
      selectedHome: "",
      premise_id: null,
      modalrequest: null,
      isLoaded: false
    };
  },
  components: {
    RequestEditingModal
  },
  computed: {
    ...mapGetters({
      requests: "requests/requests",
      homes: "requests/homes",
      request: "requests/modalRequest",
      isShow: "modal/isShow"
    }),
    lastPageButton() {
      return this.requests.pages
    },
    clickablePages() {
      const buttons = [];

      const totalPages = this.requests.pages;
      const currentPage = this.requests.page;

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else if (currentPage <= 3) {
        for (let i = 1; i <= 7; i++) {
          buttons.push(i);
        }
      } else if (currentPage >= totalPages - 3) {
        for (let i = totalPages - 6; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        for (let i = currentPage - 3; i <= currentPage + 3; i++) {
          buttons.push(i);
        }
      }

      if (currentPage + 3 !== totalPages) {
        buttons
      }

      return buttons;
    }
  },
  watch: {
    async selectedHome(newVal) {
      await this.getRequests({ pageSize: 10, pageNumber: 1, premise_id: newVal, search: this.searchQuery });
    },
    searchQuery(newVal) {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(async () => {
        await this.getRequests({
          pageSize: 10,
          pageNumber: 1,
          premise_id: this.selectedHome,
          search: newVal,
        });
      }, 500);
    }
  },
  methods: {
    ...mapActions({
      getRequests: "requests/getRequests",
      getHomesFilter: "requests/getHomesFilter",
      closeModal: 'modal/closeModal',
      showModal: 'modal/showModal',
      getRequest: 'requests/getRequest',
    }),
    showCreateModal() {
      this.showModal()
    },
    async editRequest(req) {
      this.showModal(req)
    },
    async paginateTo(pageNumber) {
      if (pageNumber === this.requests.page) return
      this.isLoaded = false
      await this.getRequests({ pageSize: 10, pageNumber: pageNumber })
      this.isLoaded = true
    },
    async prevPage() {
      if (this.requests.page_previous !== null) {
        this.isLoaded = false
        await this.getRequests({ pageSize: 10, pageNumber: this.requests.page_previous })
        this.isLoaded = true
      }
    },
    async nextPage() {
      if (this.requests.page_next < this.requests.pages) {
        this.isLoaded = false
        await this.getRequests({ pageSize: 10, pageNumber: this.requests.page_next })
        this.isLoaded = true
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    formatRequesterName(requesterObj) {
      let result = requesterObj.last_name !== undefined ? requesterObj.last_name + ' ' : ''
      result += requesterObj.first_name !== undefined ? requesterObj.first_name + ' ' : ''
      result += requesterObj.patronymic_name !== undefined ? requesterObj.patronymic_name : ''

      return result
    },
  },
  async mounted() {
    await this.getRequests({ pageSize: 10, pageNumber: 1 });
    this.isLoaded = true
    await this.getHomesFilter();
  },
};
</script>

<style lang="scss">
$main-color: #50B053;
$underline-color: #CCCCCC;
$btn-disabled-color: #cccccc;
$font-color: #585754;
$pagination-border-color: #ddd;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-button {
  margin-top: 20px;
  margin-left: auto;
}

@mixin btn-styles($bg-color: $main-color, $color: #fff) {
  padding: 5px 10px;
  border: none;
  background-color: $bg-color;
  color: $color;
  cursor: pointer;
  border-radius: 5px;

  &:disabled {
    background-color: $btn-disabled-color;
    cursor: not-allowed;
  }
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.requests-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px 12px;
    text-align: left;
  }

  th {
    border-bottom: 1px solid $underline-color;
    color: $main-color;
    font-weight: 400;
  }

  td {
    border-bottom: 1px solid $pagination-border-color;
  }
}

.page-btn {
  @include flex-center;
  background-color: #fff !important;
  color: #000 !important;
  border-radius: 50% !important;
  width: 40px;
  height: 40px;
  transition: all .4s ease;

  &:hover {
    background-color: darkgreen !important;
  }

  &:active {
    background-color: #3c8b3f;
  }

  &:focus {
    box-shadow: 0 0 5px #154516
  }

  &+& {
    margin-left: 5px;
  }

  &.active {
    background-color: $main-color !important;
    color: #fff !important;
  }

  &:hover {
    background-color: $main-color !important;
  }
}

.page-buttons-container {
  display: flex;
}

.search-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 10px;
}

.choose-field {
  position: relative;
  width: 100%;
  display: flex;
  align-items: end;
  height: 56px;

  select {
    width: 100%;
    padding: 8px;
    border: none;
    border-bottom: 1px solid $underline-color;
    background: none;
    color: $font-color;
    cursor: pointer;
    appearance: none;

    &:focus {
      outline: none;
      border-bottom: 1px solid $main-color;
    }
  }

  .arrow-down {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #999999;
  }
}

.three-dot {
  margin-left: 5px;
  font-size: 20px;
  margin-top: auto;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    @include btn-styles;

    &:disabled {
      background-color: $btn-disabled-color;
    }
  }
}

.request-number-button {}
</style>