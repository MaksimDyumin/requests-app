<template>
  <ModalWrapper>
    <div ref="field_container" class="request-editing-modal">
      <Transition name="fade" mode="out-in" appear>
        <div v-if="isLoaded">
          <div class="header-editing-modal">
            <div class="request-number">
              {{ data ? `Заявка № ${request?.number} (от ${formatDate(new Date(request.created_at))})` : 'Создание заявки' }}
            </div>
            <div class="request-type">
              {{ request ? request.status.name : 'Новая' }}
            </div>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="top-container">

              <div class="dropdown-input">
                <label for="house">Дом</label>
                <input type="text" id="house" v-model="home" @input="onHomeInput" @focus="showHomesDropdown = true" />
                <div v-if="showHomesDropdown" class="dropdown">
                  <div v-for="homeOption in homesFiltered" :key="homeOption?.id"
                    @click="selectHomeFromDropdown(homeOption?.address, homeOption.id)">
                    {{ homeOption?.address }}
                  </div>
                </div>
              </div>

              <div class="dropdown-input">
                <label for="apartment">Квартира</label>
                <input type="text" id="apartment" v-model="apartment" @input="onApartmentInput"
                  @focus="showApartmentsDropdown = true" />
                <div v-if="showApartmentsDropdown" class="dropdown">
                  <div v-for="apartmentOption in apartmentsFiltered" :key="apartmentOption.id"
                    @click="selectApartmentFromDropdown(apartmentOption.label, apartmentOption.id)">
                    {{ apartmentOption.label }}
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="dueDate">Срок</label>
                <input type="datetime-local" id="dueDate" v-model="form.dueDate" class="datetime-input"
                  :disabled="!!data" />
              </div>
            </div>

            <div class="bottom-container">
              <v-input class="bottom-container-input" labelText="Фамилия" type="text" v-model="form.lastName" />
              <v-input class="bottom-container-input" labelText="Имя" type="text" v-model="form.firstName" />
              <v-input class="bottom-container-input" labelText="Отчество" type="text" v-model="form.middleName" />
              <v-input class="bottom-container-input" labelText="Телефон" type="tel" v-model="form.username" />
            </div>

            <div class="form-group">
              <label for="description">Описание заявки</label>
              <textarea id="description" v-model="form.description" class="description-textarea" rows="6"></textarea>
            </div>

            <div class="submit-button-container">
              <button type="submit" class="submit-button">{{ data ? 'Сохранить' : 'Создать'}}</button>
            </div>
          </form>
        </div>
        <loader v-else></loader>
      </Transition>
    </div>
  </ModalWrapper>
</template>

<script>
import ModalWrapper from '../ModalWrapper.vue';
import { mapActions, mapGetters } from 'vuex';
import { debounce } from '@/functions/debounce';

export default {
  name: 'RequestModal',
  components: {
    ModalWrapper,
  },
  data() {
    return {
      home: '',
      apartment: '',
      isLoaded: false,
      showHomesDropdown: false,
      showApartmentsDropdown: false,
      homesFiltered: [],
      apartmentsFiltered: [],
      searchHomesDebounced: null,
      searchApartmentsDebounced: null,
      form: {
        premise_id: '',
        apartment_id: '',
        dueDate: '',
        lastName: '',
        firstName: '',
        middleName: '',
        username: '',
        description: '',
      },
    };
  },
  methods: {
    ...mapActions({
      getRequest: 'requests/getRequest',
      closeModal: 'modal/closeModal',
      getHomesFilter: 'requests/getHomesFilter',
      getApartments: 'requests/getApartments',
      getRequests: 'requests/getRequests',
      setRequest: 'requests/setRequest',
      createRequest: 'requests/createRequest'
    }),
    async onHomeInput() {
      this.searchHomesDebounced();
    },
    async onApartmentInput() {
      this.searchApartmentsDebounced()
    },
    async searchHomes() {
      if (this.home) {
        await this.getHomesFilter({ search: this.home })
        this.homesFiltered = this.homes?.results;
        this.showHomesDropdown = true;
      } else {
        this.showHomesDropdown = false;
        this.homesFiltered = [];
      }
    },
    async searchApartments() {
      if (this.apartment) {
        await this.getApartments({ search: this.apartment, premiseId: this.form.premise_id });
        this.apartmentsFiltered = this.apartments?.results;
        this.showApartmentsDropdown = true;
      } else {
        this.showApartmentsDropdown = false;
        this.apartmentsFiltered = [];
      }
    },
    selectHomeFromDropdown(selectedHomeAddress, electedHomePremiseId) {
      this.home = selectedHomeAddress;
      this.form.premise_id = electedHomePremiseId
      this.showHomesDropdown = false;
    },
    selectApartmentFromDropdown(selectedApartmentLabel, selectedApartmentApartmentId) {
      this.apartment = selectedApartmentLabel;
      this.form.apartment_id = selectedApartmentApartmentId
      this.showApartmentsDropdown = false;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}.${month}.${year}`;
    },
    async handleSubmit() {
      let requestBody = {
        ...this.form,
      };
      requestBody.username = requestBody.username.replace(/[+\-() ]/g, '')
      requestBody.dueDate = new Date(requestBody.dueDate).toISOString()
      requestBody = [requestBody].map((item) => {
        return {
          premise_id: item.premise_id,
          apartment_id: item.apartment_id,
          due_date: item.dueDate,
          applicant: {
            first_name: item.firstName,
            last_name: item.lastName,
            patronymic_name: item.middleName,
            username: item.apartment_id,
          },
          status_id: 1, 
          description: item.description,
        }
      })[0]
      if (this.data) {
        await this.setRequest({ appealId: this.request.id, requestBody: requestBody })
        await this.getRequests({ pageSize: 10, pageNumber: this.requests.page })
      } else {
        await this.createRequest({requestBody: requestBody})
        await this.getRequests({ pageSize: 10, pageNumber: this.requests.page })
      }
      this.closeModal()
    },
  },
  watch: {
    home() {
    },
    apartment() {
    },
  },
  computed: {
    ...mapGetters({
      request: 'requests/modalRequest',
      data: 'modal/data',
      homes: 'requests/homes',
      apartments: 'requests/apartments',
      requests: "requests/requests",
    }),
  },
  async mounted() {
    if (this.data) {
      await this.getRequest({ appeaId: this.data.id });
      const applicant = this.request.applicant;
      this.form.firstName = applicant.first_name;
      this.form.middleName = applicant.patronymic_name;
      this.form.lastName = applicant.last_name;
      this.form.username = this.request.created_by.username;
      this.form.dueDate = this.request.due_date.slice(0, this.request.due_date.length - 1);
      this.home = this.request.premise.address
      this.apartment = this.request.apartment.label
      this.isLoaded = true;
    } else {
      this.isLoaded = true;
    }
  },
  created() {
    this.searchHomesDebounced = debounce(this.searchHomes, 400);
    this.searchApartmentsDebounced = debounce(this.searchApartments, 400);
  }
};
</script>

<style scoped lang="scss">
$underline-color: #CCCCCC;

.request-editing-modal {
  background-color: #fff;
  border-radius: 5px;
  padding: 24px 32px;
  transition: all 0.5s ease;

  .header-editing-modal {
    width: 100%;
    padding: 8px 0;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    transition: all .4s ease-in-out;
  }

  .request-type {
    font-weight: normal;
    transition: all .4s ease-in-out;
  }
}

.top-container {
  display: flex;
  margin-top: 20px;
  transition: all .4s ease-in-out;

  .dropdown-input+.dropdown-input {
    margin: 0 10px;
  }

  .form-group {
    margin: 0 10px;
  }
}

.bottom-container {
  display: flex;
  transition: all .4s ease-in-out;

  .bottom-container-input+.bottom-container-input {
    margin: 0 10px;
    font-size: 30px;
  }
}

.form-group {
  margin-bottom: 20px;
  margin-top: 32px;
  transition: all .4s ease-in-out;

  label {
    font-size: 12px;
    color: #50b053;
    margin-bottom: 5px;
  }
}

.dropdown-input {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 56px;
  margin-bottom: 20px;

  label {
    font-size: 12px;
    color: #50b053;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: none;
    border-bottom: 1px solid #CCCCCC;
    background: none;
    color: #333;
    cursor: text;

    &:focus {
      outline: none;
      border-bottom: 1px solid #50b053;
    }
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #CCCCCC;
    z-index: 10;
    max-height: 300px;
    overflow-y: scroll;

    div {
      padding: 8px;
      cursor: pointer;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}

.datetime-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  outline: none;
  border: none;
  border-bottom: 1px solid $underline-color;
}

.description-textarea {
  width: 100%;
  padding: 8px;
  resize: none;
  border: none;
  outline: none;
  border-bottom: 1px solid #CCCCCC;
}

.submit-button-container {
  display: flex;
  justify-content: flex-end;

  .submit-button {
    background-color: #50b053;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: darkgreen;
    }
  }
}
</style>